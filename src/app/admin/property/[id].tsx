import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { ChoiceGroup } from '@/components/forms/ChoiceGroup';
import { TextField } from '@/components/forms/TextField';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatDate, formatMoney } from '@/lib/utils/format';
import { clearFlags, flagProperty, getAdminProperty } from '@/services/admin';

const REASONS = [
  { label: 'Unresolved complaints', value: 'Unresolved complaints' }, { label: 'Safety concern', value: 'Safety concern' },
  { label: 'Suspicious activity', value: 'Suspicious activity' }, { label: 'Other', value: 'Other' },
];

export default function AdminPropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = String(id);
  const { user } = useSession();
  const { data, loading, error, refetch } = useMockQuery(`admin-property-${propertyId}`, () => getAdminProperty(propertyId));
  const [sheet, setSheet] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [reason, setReason] = useState('Unresolved complaints');
  const [note, setNote] = useState('');
  const header = <AppHeader title={data?.property.name ?? 'Property'} subtitle={data ? `${data.property.location.area}, ${data.property.location.city}` : undefined} showBack />;

  if (error) return <ScreenContainer header={header}><ErrorState message={error} onRetry={refetch} /></ScreenContainer>;
  if (loading && !data) return <ScreenContainer header={header}><LoadingState /></ScreenContainer>;
  if (!data) return <ScreenContainer header={header}><EmptyState icon="business-outline" title="Property not found" /></ScreenContainer>;

  const { property, owner, stats, flags, openRequests } = data;

  return (
    <ScreenContainer header={header}>
      {flags.length ? (
        <Card style={{ backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft, marginBottom: spacing.lg }}>
          <StatusBadge label="Flagged" tone="danger" icon="flag" />
          {flags.map((f) => (
            <View key={f.id} style={{ marginTop: spacing.sm }}>
              <AppText variant="bodyStrong" color={colors.danger}>{f.reason}</AppText>
              {f.note ? <AppText color={colors.danger}>{f.note}</AppText> : null}
              <AppText variant="caption" color={colors.danger}>{formatDate(f.createdAt)}</AppText>
            </View>
          ))}
        </Card>
      ) : null}

      <View style={styles.grid}>
        <StatCard label="Units" value={stats.totalUnits} icon="grid-outline" />
        <StatCard label="Occupancy" value={`${stats.occupancyRate}%`} icon="pie-chart-outline" tone="success" />
        <StatCard label="Vacant" value={stats.vacant} icon="key-outline" tone="info" />
        <StatCard label="Open requests" value={openRequests} icon="construct-outline" tone="warning" />
      </View>

      <SectionHeader title="Property" />
      <Card>
        <InfoRow label="Owner" value={owner?.fullName ?? 'Unknown'} />
        <InfoRow label="Type" value={property.type.charAt(0).toUpperCase() + property.type.slice(1)} />
        <InfoRow label="Location" value={`${property.location.area}, ${property.location.city}`} />
        <InfoRow label="Added" value={formatDate(property.createdAt)} />
        <AppText color={colors.textMuted} style={{ marginTop: spacing.sm }}>{property.description}</AppText>
      </Card>

      <SectionHeader title="Rent this month (totals only)" />
      <Card>
        <InfoRow label="Expected" value={formatMoney(stats.expectedRent)} />
        <InfoRow label="Collected" value={formatMoney(stats.collected)} />
        <AppText variant="caption" color={colors.textMuted} style={{ marginTop: spacing.sm }}>Individual tenant payments are not shown to administrators.</AppText>
      </Card>

      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        <Button label="Flag or report property" variant="danger" icon="flag-outline" onPress={() => setSheet(true)} />
        {flags.length ? <Button label="Clear flags" variant="secondary" onPress={() => setConfirmClear(true)} /> : null}
      </View>

      <BottomSheet visible={sheet} onClose={() => setSheet(false)} title="Flag this property">
        <View style={{ paddingHorizontal: spacing.lg }}>
          <ChoiceGroup label="Reason" options={REASONS} value={reason} onChange={setReason} />
          <TextField label="Note (optional)" value={note} onChangeText={setNote} multiline placeholder="What did you notice?" />
          <Button label="Submit flag" variant="danger" onPress={() => { flagProperty(propertyId, reason, note, user?.id ?? ''); /* TODO(supabase): audit log */ setNote(''); setSheet(false); refetch(); }} />
        </View>
      </BottomSheet>

      <ConfirmationModal
        visible={confirmClear} title="Clear all flags?" message="The property will no longer appear as flagged."
        confirmLabel="Clear flags" onCancel={() => setConfirmClear(false)}
        onConfirm={() => { clearFlags(propertyId); setConfirmClear(false); refetch(); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md } });

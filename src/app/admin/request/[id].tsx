import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { useMockQuery } from '@/hooks/useMockQuery';
import { formatDate, formatMoney } from '@/lib/utils/format';
import { maintenanceCategoryLabel } from '@/lib/utils/meta';
import { maintenanceStatusMeta, priorityMeta } from '@/lib/utils/status';
import { getAdminRequest, resolveDispute } from '@/services/admin';

export default function AdminRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error, refetch } = useMockQuery(`admin-request-${id}`, () => getAdminRequest(String(id)));
  const [confirm, setConfirm] = useState(false);
  const header = <AppHeader title="Request details" showBack />;

  if (error) return <ScreenContainer header={header}><ErrorState message={error} onRetry={refetch} /></ScreenContainer>;
  if (loading && !data) return <ScreenContainer header={header}><LoadingState /></ScreenContainer>;
  if (!data) return <ScreenContainer header={header}><EmptyState icon="construct-outline" title="Request not found" /></ScreenContainer>;

  const { request, property, unit, tenant, owner, dispute } = data;
  return (
    <ScreenContainer header={header}>
      <Card>
        <AppText variant="heading">{request.title}</AppText>
        <AppText color={colors.textMuted} style={{ marginVertical: spacing.sm }}>{request.description}</AppText>
        <View style={styles.badges}>
          <MetaBadge meta={maintenanceStatusMeta[request.status]} />
          <MetaBadge meta={priorityMeta[request.priority]} />
        </View>
      </Card>

      <SectionHeader title="Details" />
      <Card>
        <InfoRow label="Property" value={property.name} />
        <InfoRow label="Unit" value={unit.unitNumber} />
        <InfoRow label="Tenant" value={tenant?.fullName ?? 'Unknown'} />
        <InfoRow label="Landlord" value={owner?.fullName ?? 'Unknown'} />
        <InfoRow label="Category" value={maintenanceCategoryLabel[request.category]} />
        <InfoRow label="Reported" value={formatDate(request.createdAt)} />
        <InfoRow label="Provider" value={request.assignedProvider ?? 'Not assigned'} />
        {request.cost ? <InfoRow label="Cost" value={formatMoney(request.cost)} /> : null}
      </Card>

      {dispute ? (
        <>
          <SectionHeader title="Dispute" />
          <Card>
            <StatusBadge label={dispute.status === 'open' ? 'Open' : 'Resolved'} tone={dispute.status === 'open' ? 'danger' : 'success'} icon={dispute.status === 'open' ? 'alert-circle' : 'checkmark-circle'} />
            <AppText style={{ marginTop: spacing.sm }}>{dispute.reason}</AppText>
            <AppText variant="caption" color={colors.textMuted}>Raised {formatDate(dispute.createdAt)}</AppText>
            {dispute.status === 'open' ? <View style={{ marginTop: spacing.md }}><Button label="Mark dispute resolved" icon="checkmark-circle-outline" onPress={() => setConfirm(true)} /></View> : null}
          </Card>
        </>
      ) : null}

      <ConfirmationModal
        visible={confirm} title="Mark dispute resolved?" message="Both the tenant and landlord should agree before you close a dispute."
        confirmLabel="Resolve" onCancel={() => setConfirm(false)}
        onConfirm={() => { if (dispute) resolveDispute(dispute.id); /* TODO(supabase): audit log + notify both parties */ setConfirm(false); refetch(); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ badges: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' } });

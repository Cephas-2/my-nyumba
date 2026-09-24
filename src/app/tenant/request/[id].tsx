import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetaBadge } from '@/components/ui/StatusBadge';
import { Timeline } from '@/components/ui/Timeline';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatDate } from '@/lib/utils/format';
import { maintenanceCategoryLabel } from '@/lib/utils/meta';
import { maintenanceStatusMeta, priorityMeta } from '@/lib/utils/status';
import { getTenantRequest } from '@/services/tenant';

export default function TenantRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, loading } = useMockQuery(`tenant-request-${id}`, () => getTenantRequest(String(id), tenantId));
  const header = <AppHeader title="Request details" showBack />;

  if (loading && !data) return <ScreenContainer header={header}><LoadingState /></ScreenContainer>;
  if (!data) return <ScreenContainer header={header}><EmptyState icon="construct-outline" title="Request not found" message="It may not exist or may belong to someone else." /></ScreenContainer>;

  const { request, unit, property } = data.item;
  return (
    <ScreenContainer header={header}>
      <Card>
        <AppText variant="heading">{request.title}</AppText>
        <AppText variant="caption" color={colors.textMuted} style={{ marginBottom: spacing.md }}>Unit {unit.unitNumber}, {property.name}</AppText>
        <View style={styles.badges}>
          <MetaBadge meta={maintenanceStatusMeta[request.status]} />
          <MetaBadge meta={priorityMeta[request.priority]} />
        </View>
      </Card>

      <SectionHeader title="The problem" />
      <Card><AppText>{request.description}</AppText></Card>

      <SectionHeader title="Photos" />
      <Card>
        <View style={styles.photo}>
          <Icon name="image-outline" size={26} color={colors.textMuted} />
          <AppText variant="caption" color={colors.textMuted} align="center">Photos and videos will appear here once uploads are connected.</AppText>
        </View>
      </Card>

      <SectionHeader title="Details" />
      <Card>
        <InfoRow label="Category" value={maintenanceCategoryLabel[request.category]} />
        <InfoRow label="Reported" value={formatDate(request.createdAt)} />
        <InfoRow label="Assigned provider" value={request.assignedProvider ?? 'Not yet assigned'} />
      </Card>

      <SectionHeader title="Updates" />
      <Card><Timeline entries={data.timeline} /></Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  photo: { minHeight: 90, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.md },
});

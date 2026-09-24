import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { MaintenanceCard } from '@/components/cards/MaintenanceCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMockQuery } from '@/hooks/useMockQuery';
import { formatRelative } from '@/lib/utils/format';
import { listAllRequests, listDisputes } from '@/services/admin';

type Tab = 'requests' | 'disputes';

export default function AdminMaintenanceScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useMockQuery('admin-maintenance', () => ({ requests: listAllRequests(), disputes: listDisputes() }));
  const [tab, setTab] = useState<Tab>('requests');
  const open = data?.disputes.filter((d) => d.dispute?.status === 'open').length ?? 0;
  const active = data?.requests.filter((r) => r.request.status !== 'completed').length ?? 0;

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="Maintenance" subtitle="Platform-wide monitoring" />} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : (
        <>
          <View style={styles.grid}>
            <StatCard label="Active requests" value={active} icon="construct-outline" tone="warning" />
            <StatCard label="Open disputes" value={open} icon="alert-circle-outline" tone="danger" />
          </View>
          <View style={styles.tabs}>
            <FilterButton label="Requests" selected={tab === 'requests'} onPress={() => setTab('requests')} count={data.requests.length} />
            <FilterButton label="Disputes" selected={tab === 'disputes'} onPress={() => setTab('disputes')} count={data.disputes.length} />
          </View>
          {tab === 'requests' ? (
            <View style={{ gap: spacing.md }}>
              {data.requests.map((i) => <MaintenanceCard key={i.request.id} item={i} onPress={() => router.push(`/admin/request/${i.request.id}`)} />)}
            </View>
          ) : data.disputes.length === 0 ? (
            <EmptyState icon="checkmark-circle-outline" title="No disputes" message="Nothing needs your attention." />
          ) : (
            <View style={{ gap: spacing.md }}>
              {data.disputes.map((i) => (
                <Card key={i.dispute?.id} onPress={() => router.push(`/admin/request/${i.request.id}`)} accessibilityLabel={`Dispute about ${i.request.title}`}>
                  <AppText variant="bodyStrong">{i.request.title}</AppText>
                  <AppText variant="caption" color={colors.textMuted}>{i.property.name} · Unit {i.unit.unitNumber}</AppText>
                  <AppText style={{ marginVertical: spacing.sm }}>{i.dispute?.reason}</AppText>
                  <View style={styles.row}>
                    <StatusBadge label={i.dispute?.status === 'open' ? 'Open' : 'Resolved'} tone={i.dispute?.status === 'open' ? 'danger' : 'success'} icon={i.dispute?.status === 'open' ? 'alert-circle' : 'checkmark-circle'} />
                    {i.dispute ? <AppText variant="caption" color={colors.textMuted}>{formatRelative(i.dispute.createdAt)}</AppText> : null}
                  </View>
                </Card>
              ))}
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

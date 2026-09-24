import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { MaintenanceCard } from '@/components/cards/MaintenanceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatCard } from '@/components/ui/StatCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { maintenanceStatusMeta } from '@/lib/utils/status';
import { listLandlordMaintenance } from '@/services/landlord';
import type { MaintenanceStatus } from '@/types';

type Filter = 'all' | MaintenanceStatus;
const STATUSES: MaintenanceStatus[] = ['new', 'assigned', 'in_progress', 'completed'];

export default function MaintenanceScreen() {
  const router = useRouter();
  const { user } = useSession();
  const landlordId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`maintenance-${landlordId}`, () => listLandlordMaintenance(landlordId));
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c: Record<MaintenanceStatus, number> = { new: 0, assigned: 0, in_progress: 0, completed: 0 };
    (data ?? []).forEach((i) => { c[i.request.status] += 1; });
    return c;
  }, [data]);
  const visible = (data ?? []).filter((i) => filter === 'all' || i.request.status === filter);

  return (
    <ScreenContainer hasTabBar refreshing={loading && !!data} onRefresh={refetch} header={<AppHeader title="Maintenance" subtitle="Requests from your tenants" />}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState label="Loading requests..." /> : (
        <>
          <View style={styles.grid}>
            {STATUSES.map((s) => (
              <StatCard key={s} label={maintenanceStatusMeta[s].label} value={counts[s]} icon={maintenanceStatusMeta[s].icon} tone={maintenanceStatusMeta[s].tone} />
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.lg }}>
            <FilterButton label="All" selected={filter === 'all'} onPress={() => setFilter('all')} count={data.length} />
            {STATUSES.map((s) => <FilterButton key={s} label={maintenanceStatusMeta[s].label} selected={filter === s} onPress={() => setFilter(s)} />)}
          </ScrollView>
          <View style={{ gap: spacing.md }}>
            {visible.length === 0 ? <EmptyState icon="construct-outline" title="No requests here" message="Nothing matches this filter right now." /> :
              visible.map((i) => <MaintenanceCard key={i.request.id} item={i} onPress={() => router.push(`/landlord/request/${i.request.id}`)} />)}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm } });

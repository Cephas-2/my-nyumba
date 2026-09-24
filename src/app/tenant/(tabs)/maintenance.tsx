import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { MaintenanceCard } from '@/components/cards/MaintenanceCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { listTenantRequests } from '@/services/tenant';

type Filter = 'all' | 'open' | 'completed';

export default function TenantMaintenanceScreen() {
  const router = useRouter();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`tenant-requests-${tenantId}`, () => listTenantRequests(tenantId));
  const [filter, setFilter] = useState<Filter>('all');
  const visible = (data ?? []).filter((i) => filter === 'all' || (filter === 'completed') === (i.request.status === 'completed'));

  return (
    <ScreenContainer
      hasTabBar refreshing={loading && !!data} onRefresh={refetch}
      header={<AppHeader title="My requests" right={<IconButton icon="add" label="Report an issue" filled onPress={() => router.push('/tenant/report-issue')} />} />}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
        <FilterButton label="All" selected={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterButton label="Open" selected={filter === 'open'} onPress={() => setFilter('open')} />
        <FilterButton label="Completed" selected={filter === 'completed'} onPress={() => setFilter('completed')} />
      </ScrollView>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : visible.length === 0 ? (
        <EmptyState icon="construct-outline" title="No requests" message="Something broken at home? Report it and we will keep you updated." actionLabel="Report an issue" onAction={() => router.push('/tenant/report-issue')} />
      ) : (
        <View style={{ gap: spacing.md }}>
          {visible.map((i) => <MaintenanceCard key={i.request.id} item={i} onPress={() => router.push(`/tenant/request/${i.request.id}`)} />)}
        </View>
      )}
    </ScreenContainer>
  );
}

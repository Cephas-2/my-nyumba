import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { SearchBar } from '@/components/forms/SearchBar';
import { TenantCard } from '@/components/cards/TenantCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { paymentStatusMeta } from '@/lib/utils/status';
import { listLandlordTenants } from '@/services/landlord';
import type { PaymentStatus } from '@/types';

type Filter = 'all' | PaymentStatus;
const FILTERS: Filter[] = ['all', 'paid', 'partial', 'pending', 'overdue'];

export default function TenantsScreen() {
  const router = useRouter();
  const { user } = useSession();
  const landlordId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`tenants-${landlordId}`, () => listLandlordTenants(landlordId));
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((r) =>
      (filter === 'all' || r.payment?.status === filter) &&
      (!q || `${r.tenant.fullName} ${r.unit.unitNumber} ${r.property.name}`.toLowerCase().includes(q)));
  }, [data, query, filter]);

  return (
    <ScreenContainer
      hasTabBar refreshing={loading && !!data} onRefresh={refetch}
      header={<AppHeader title="Tenants" subtitle={data ? `${visible.length} tenants` : undefined} right={<IconButton icon="person-add-outline" label="Add tenant" filled onPress={() => router.push('/landlord/tenant/new')} />} />}
    >
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search tenant, unit or property" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.lg }}>
        {FILTERS.map((f) => (
          <FilterButton key={f} label={f === 'all' ? 'All' : paymentStatusMeta[f].label} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>
      <View style={{ gap: spacing.md }}>
        {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState label="Loading tenants..." /> : visible.length === 0 ? (
          <EmptyState icon="people-outline" title="No tenants match" message="Try a different search or filter." />
        ) : visible.map((r) => <TenantCard key={r.lease.id} record={r} onPress={() => router.push(`/landlord/tenant/${r.tenant.id}`)} />)}
      </View>
    </ScreenContainer>
  );
}

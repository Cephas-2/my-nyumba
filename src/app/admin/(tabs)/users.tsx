import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { SearchBar } from '@/components/forms/SearchBar';
import { UserCard } from '@/components/cards/UserCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { roleMeta } from '@/lib/utils/meta';
import { listUsers } from '@/services/admin';
import type { UserRole } from '@/types';

type Filter = 'all' | UserRole;
const FILTERS: Filter[] = ['all', 'landlord', 'tenant', 'property_manager', 'admin'];

export default function AdminUsersScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useMockQuery('admin-users', () => listUsers());
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((u) => (filter === 'all' || u.role === filter) && (!q || `${u.fullName} ${u.email} ${u.phone}`.toLowerCase().includes(q)));
  }, [data, query, filter]);

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="Users" subtitle={data ? `${visible.length} accounts` : undefined} />} refreshing={loading && !!data} onRefresh={refetch}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search name, email or phone" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.lg }}>
        {FILTERS.map((f) => (
          <FilterButton key={f} label={f === 'all' ? 'All' : roleMeta[f].label} selected={filter === f} onPress={() => setFilter(f)} count={data ? (f === 'all' ? data.length : data.filter((u) => u.role === f).length) : undefined} />
        ))}
      </ScrollView>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : visible.length === 0 ? (
        <EmptyState icon="people-outline" title="No users found" message="Try a different search or filter." />
      ) : (
        <View style={{ gap: spacing.md }}>{visible.map((u) => <UserCard key={u.id} user={u} onPress={() => router.push(`/admin/user/${u.id}`)} />)}</View>
      )}
    </ScreenContainer>
  );
}

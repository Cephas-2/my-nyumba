import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { SearchBar } from '@/components/forms/SearchBar';
import { AdminPropertyCard } from '@/components/cards/AdminPropertyCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { listAllProperties } from '@/services/admin';

export default function AdminPropertiesScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useMockQuery('admin-properties', () => listAllProperties());
  const [query, setQuery] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((i) =>
      (!flaggedOnly || i.flags.length > 0) &&
      (!q || `${i.property.name} ${i.property.location.city} ${i.owner?.fullName ?? ''}`.toLowerCase().includes(q)));
  }, [data, query, flaggedOnly]);

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="Properties" subtitle={data ? `${visible.length} on the platform` : undefined} />} refreshing={loading && !!data} onRefresh={refetch}>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search property, city or owner" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.lg }}>
        <FilterButton label="All" selected={!flaggedOnly} onPress={() => setFlaggedOnly(false)} />
        <FilterButton label="Flagged" selected={flaggedOnly} onPress={() => setFlaggedOnly(true)} count={data?.filter((i) => i.flags.length).length} />
      </ScrollView>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : visible.length === 0 ? (
        <EmptyState icon="business-outline" title="No properties found" message="Try a different search or filter." />
      ) : (
        <View style={{ gap: spacing.md }}>{visible.map((i) => <AdminPropertyCard key={i.property.id} item={i} onPress={() => router.push(`/admin/property/${i.property.id}`)} />)}</View>
      )}
    </ScreenContainer>
  );
}

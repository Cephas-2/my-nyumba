import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { SearchBar } from '@/components/forms/SearchBar';
import { PropertyCard } from '@/components/cards/PropertyCard';
import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { MenuRow } from '@/components/ui/MenuRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { listLandlordProperties, type PropertyWithStats } from '@/services/landlord';

export default function PropertiesScreen() {
  const router = useRouter();
  const { user } = useSession();
  const landlordId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`properties-${landlordId}`, () => listLandlordProperties(landlordId));
  const [query, setQuery] = useState('');
  const [archived, setArchived] = useState<string[]>([]);
  const [menuFor, setMenuFor] = useState<PropertyWithStats | null>(null);
  const [confirmFor, setConfirmFor] = useState<PropertyWithStats | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(({ property }) =>
      !archived.includes(property.id) &&
      (!q || `${property.name} ${property.location.area} ${property.location.city}`.toLowerCase().includes(q)));
  }, [data, query, archived]);

  return (
    <ScreenContainer
      hasTabBar
      refreshing={loading && !!data}
      onRefresh={refetch}
      header={<AppHeader title="Properties" subtitle={data ? `${visible.length} properties` : undefined} right={<IconButton icon="add" label="Add property" filled onPress={() => router.push('/landlord/property/new')} />} />}
    >
      <SearchBar value={query} onChangeText={setQuery} placeholder="Search by name or location" />
      <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
        {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState label="Loading properties..." /> : visible.length === 0 ? (
          <EmptyState icon="business-outline" title="No properties found" message={query ? 'Try a different search.' : 'Add your first property to get started.'} actionLabel={query ? undefined : 'Add property'} onAction={() => router.push('/landlord/property/new')} />
        ) : visible.map((item) => (
          <PropertyCard key={item.property.id} item={item} onView={() => router.push(`/landlord/property/${item.property.id}`)} onMore={() => setMenuFor(item)} />
        ))}
      </View>

      <BottomSheet visible={!!menuFor} onClose={() => setMenuFor(null)} title={menuFor?.property.name}>
        <MenuRow icon="eye-outline" label="View property" onPress={() => { const id = menuFor?.property.id; setMenuFor(null); if (id) router.push(`/landlord/property/${id}`); }} />
        <MenuRow icon="create-outline" label="Edit property" onPress={() => { const id = menuFor?.property.id; setMenuFor(null); if (id) router.push({ pathname: '/landlord/property/new', params: { editId: id } }); }} />
        <MenuRow icon="archive-outline" label="Archive property" destructive onPress={() => { setConfirmFor(menuFor); setMenuFor(null); }} />
      </BottomSheet>

      <ConfirmationModal
        visible={!!confirmFor}
        title="Archive this property?"
        message={`${confirmFor?.property.name ?? 'This property'} will be hidden from your active list. Tenants, units and payment history are kept.`}
        confirmLabel="Archive"
        destructive
        onCancel={() => setConfirmFor(null)}
        onConfirm={() => { if (confirmFor) setArchived((a) => [...a, confirmFor.property.id]); setConfirmFor(null); /* TODO(supabase): set archived = true */ }}
      />
    </ScreenContainer>
  );
}

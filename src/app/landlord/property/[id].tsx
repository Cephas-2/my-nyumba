import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { ActivityItem } from '@/components/cards/ActivityItem';
import { MaintenanceCard } from '@/components/cards/MaintenanceCard';
import { PaymentCard } from '@/components/cards/PaymentCard';
import { TenantCard } from '@/components/cards/TenantCard';
import { UnitCard } from '@/components/cards/UnitCard';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { IconButton } from '@/components/ui/IconButton';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useMockQuery } from '@/hooks/useMockQuery';
import { formatDate, formatMoney } from '@/lib/utils/format';
import { getPropertyDetail } from '@/services/landlord';

type TabKey = 'overview' | 'units' | 'tenants' | 'maintenance' | 'financials';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' }, { key: 'units', label: 'Units' }, { key: 'tenants', label: 'Tenants' },
  { key: 'maintenance', label: 'Maintenance' }, { key: 'financials', label: 'Financials' },
];

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = String(id);
  const [tab, setTab] = useState<TabKey>('overview');
  const { data, loading, error, refetch } = useMockQuery(`property-${propertyId}`, () => getPropertyDetail(propertyId));

  const header = (
    <AppHeader
      title={data?.property.name ?? 'Property'} subtitle={data ? `${data.property.location.area}, ${data.property.location.city}` : undefined} showBack
      right={data ? <IconButton icon="create-outline" label="Edit property" onPress={() => router.push({ pathname: '/landlord/property/new', params: { editId: propertyId } })} /> : undefined}
    />
  );

  if (error) return <ScreenContainer header={header}><ErrorState message={error} onRetry={refetch} /></ScreenContainer>;
  if (loading && !data) return <ScreenContainer header={header}><LoadingState label="Loading property..." /></ScreenContainer>;
  if (!data) return <ScreenContainer header={header}><EmptyState icon="business-outline" title="Property not found" message="It may have been archived or removed." actionLabel="Back to properties" onAction={() => router.replace('/landlord/properties')} /></ScreenContainer>;

  const { property, stats } = data;

  return (
    <ScreenContainer header={header} refreshing={loading} onRefresh={refetch}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
        {TABS.map((t) => <FilterButton key={t.key} label={t.label} selected={tab === t.key} onPress={() => setTab(t.key)} />)}
      </ScrollView>

      {tab === 'overview' && (
        <View style={{ gap: spacing.lg }}>
          <View style={styles.grid}>
            <StatCard label="Units" value={stats.totalUnits} icon="grid-outline" />
            <StatCard label="Occupancy" value={`${stats.occupancyRate}%`} icon="pie-chart-outline" tone="success" />
            <StatCard label="Vacant" value={stats.vacant} icon="key-outline" tone="info" />
            <StatCard label="Open requests" value={data.requests.filter((r) => r.request.status !== 'completed').length} icon="construct-outline" tone="warning" />
          </View>
          <Card>
            <AppText variant="heading" style={{ marginBottom: spacing.sm }}>Property information</AppText>
            <InfoRow label="Type" value={property.type.charAt(0).toUpperCase() + property.type.slice(1)} />
            <InfoRow label="Location" value={`${property.location.area}, ${property.location.city}`} />
            <InfoRow label="Rent due" value={`Day ${property.rentDueDay} of each month`} />
            <InfoRow label="Added" value={formatDate(property.createdAt)} />
            <AppText color={colors.textMuted} style={{ marginTop: spacing.sm }}>{property.description}</AppText>
          </Card>
          <Card>
            <AppText variant="heading" style={{ marginBottom: spacing.sm }}>Rent summary</AppText>
            <InfoRow label="Expected" value={formatMoney(stats.expectedRent)} />
            <InfoRow label="Collected" value={formatMoney(stats.collected)} />
            <InfoRow label="Outstanding" value={formatMoney(stats.outstanding)} />
          </Card>
          <View>
            <SectionHeader title="Recent activity" />
            <Card>
              {data.activity.length ? data.activity.map((e) => <ActivityItem key={e.id} event={e} />) : <AppText color={colors.textMuted}>No recent activity.</AppText>}
            </Card>
          </View>
        </View>
      )}

      {tab === 'units' && (
        <View style={{ gap: spacing.md }}>
          {data.units.map((r) => <UnitCard key={r.unit.id} record={r} onPress={() => router.push(`/landlord/unit/${r.unit.id}`)} />)}
        </View>
      )}

      {tab === 'tenants' && (
        <View style={{ gap: spacing.md }}>
          {data.tenants.length === 0 ? <EmptyState icon="people-outline" title="No tenants yet" message="Assign a tenant to a vacant unit to see them here." /> :
            data.tenants.map((r) => <TenantCard key={r.lease.id} record={r} onPress={() => router.push(`/landlord/tenant/${r.tenant.id}`)} />)}
        </View>
      )}

      {tab === 'maintenance' && (
        <View style={{ gap: spacing.md }}>
          {data.requests.length === 0 ? <EmptyState icon="construct-outline" title="No maintenance requests" message="Requests from tenants of this property will appear here." /> :
            data.requests.map((i) => <MaintenanceCard key={i.request.id} item={i} onPress={() => router.push(`/landlord/request/${i.request.id}`)} />)}
        </View>
      )}

      {tab === 'financials' && (
        <View style={{ gap: spacing.md }}>
          <View style={styles.grid}>
            <StatCard label="Expected" value={formatMoney(stats.expectedRent)} icon="wallet-outline" />
            <StatCard label="Collected" value={formatMoney(stats.collected)} icon="checkmark-circle-outline" tone="success" />
            <StatCard label="Outstanding" value={formatMoney(stats.outstanding)} icon="alert-circle-outline" tone="danger" />
          </View>
          <SectionHeader title="This month's rent" />
          {data.payments.map((p) => {
            const rec = data.units.find((u) => u.unit.id === p.unitId);
            return <PaymentCard key={p.id} payment={p} title={rec?.tenant?.fullName ?? 'Tenant'} subtitle={`Unit ${rec?.unit.unitNumber ?? ''}`} onPress={() => router.push(`/landlord/rent/${p.id}`)} />;
          })}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md } });

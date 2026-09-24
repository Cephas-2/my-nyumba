import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { UserCard } from '@/components/cards/UserCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { BarChart } from '@/components/ui/BarChart';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { MenuRow } from '@/components/ui/MenuRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useMockQuery } from '@/hooks/useMockQuery';
import { getPlatformReports, getPlatformStats, listUsers } from '@/services/admin';

export default function AdminOverviewScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useMockQuery('admin-overview', () => ({
    stats: getPlatformStats(), recent: listUsers().slice(0, 3), signups: getPlatformReports().signups,
  }));

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="Platform overview" subtitle="My Nyumba administration" />} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState label="Loading platform data..." /> : (
        <>
          <View style={styles.grid}>
            <StatCard label="Total users" value={data.stats.totalUsers} icon="people-outline" />
            <StatCard label="Landlords" value={data.stats.landlords} icon="business-outline" tone="info" />
            <StatCard label="Tenants" value={data.stats.tenants} icon="home-outline" tone="success" />
            <StatCard label="Properties" value={data.stats.properties} icon="location-outline" />
            <StatCard label="Units" value={data.stats.units} icon="grid-outline" tone="info" />
            <StatCard label="Active requests" value={data.stats.activeRequests} icon="construct-outline" tone="warning" />
          </View>

          <SectionHeader title="Needs attention" />
          <Card padded={false}>
            <MenuRow icon="alert-circle-outline" label="Open disputes" subtitle="Maintenance disagreements" badge={data.stats.openDisputes} onPress={() => router.push('/admin/maintenance')} />
            <MenuRow icon="flag-outline" label="Flagged properties" badge={data.stats.flaggedProperties} onPress={() => router.push('/admin/properties')} />
            <MenuRow icon="ban-outline" label="Suspended accounts" badge={data.stats.suspended} onPress={() => router.push('/admin/users')} />
          </Card>

          <SectionHeader title="New sign-ups" />
          <Card><BarChart data={data.signups} /></Card>

          <SectionHeader title="Newest users" actionLabel="All users" onAction={() => router.push('/admin/users')} />
          <View style={{ gap: spacing.md }}>
            {data.recent.map((u) => <UserCard key={u.id} user={u} onPress={() => router.push(`/admin/user/${u.id}`)} />)}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm } });

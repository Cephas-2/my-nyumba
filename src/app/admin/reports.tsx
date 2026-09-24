import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { BarChart, HorizontalBars } from '@/components/ui/BarChart';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useMockQuery } from '@/hooks/useMockQuery';
import { formatMoney } from '@/lib/utils/format';
import { getPlatformReports } from '@/services/admin';

export default function AdminReportsScreen() {
  const { data, loading, error, refetch } = useMockQuery('admin-reports', () => getPlatformReports());
  return (
    <ScreenContainer header={<AppHeader title="Reports" subtitle="Platform statistics" showBack />} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : (
        <>
          <View style={styles.grid}>
            <StatCard label="Rent expected" value={formatMoney(data.expected)} icon="wallet-outline" />
            <StatCard label="Rent collected" value={formatMoney(data.collected)} icon="checkmark-circle-outline" tone="success" />
            <StatCard label="Occupancy" value={`${data.occupancyRate}%`} icon="pie-chart-outline" tone="info" />
            <StatCard label="Maintenance requests" value={data.totalRequests} icon="construct-outline" tone="warning" />
          </View>
          <SectionHeader title="New sign-ups (last 6 months)" />
          <Card><BarChart data={data.signups} /></Card>
          <SectionHeader title="Rent status this month" />
          <Card><HorizontalBars data={data.rentStatus} color={colors.success} /></Card>
          <SectionHeader title="Requests by category" />
          <Card><HorizontalBars data={data.requestsByCategory} color={colors.warning} /></Card>
          <SectionHeader title="Properties by city" />
          <Card><HorizontalBars data={data.propertiesByCity} /></Card>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm } });

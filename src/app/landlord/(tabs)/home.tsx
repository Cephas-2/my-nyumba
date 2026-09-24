import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, toneColors } from '@/constants/theme';
import { ActivityItem } from '@/components/cards/ActivityItem';
import { RentStatusCard } from '@/components/cards/RentStatusCard';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Icon, type IconName } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { LogoMark } from '@/components/ui/Logo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentedBar } from '@/components/ui/SegmentedBar';
import { StatCard } from '@/components/ui/StatCard';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatMoney, greeting } from '@/lib/utils/format';
import { getPortfolioSummary, getRecentActivity } from '@/services/landlord';

const ACTIONS: { label: string; icon: IconName; href: string }[] = [
  { label: 'Add Property', icon: 'business-outline', href: '/landlord/property/new' },
  { label: 'Add Tenant', icon: 'person-add-outline', href: '/landlord/tenant/new' },
  { label: 'Record Payment', icon: 'cash-outline', href: '/landlord/rent/record' },
  { label: 'Maintenance', icon: 'construct-outline', href: '/landlord/maintenance' },
];

export default function LandlordHomeScreen() {
  const router = useRouter();
  const { user } = useSession();
  const landlordId = user?.id ?? '';
  const firstName = user?.fullName.split(' ')[0] ?? '';
  const { data, loading, error, refetch } = useMockQuery(`landlord-home-${landlordId}`, () => ({
    summary: getPortfolioSummary(landlordId),
    activity: getRecentActivity(landlordId, 5),
  }));

  const header = (
    <View style={styles.header}>
      <LogoMark size={40} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption" color={colors.textMuted}>{greeting()},</AppText>
        <AppText variant="title" numberOfLines={1}>{firstName}</AppText>
      </View>
      <IconButton icon="notifications-outline" label="Notices and notifications" onPress={() => router.push('/landlord/notices')} />
    </View>
  );

  const s = data?.summary;
  const collectedPct = s && s.expectedRent > 0 ? Math.round((s.collected / s.expectedRent) * 100) : 0;

  return (
    <ScreenContainer hasTabBar header={header} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data || !s ? <LoadingState label="Loading your dashboard..." /> : (
        <>
          <View style={styles.grid}>
            <StatCard label="Total properties" value={s.totalProperties} icon="business-outline" />
            <StatCard label="Total units" value={s.totalUnits} icon="grid-outline" tone="info" />
            <StatCard label="Occupied units" value={s.occupiedUnits} icon="person-outline" tone="success" />
            <StatCard label="Vacant units" value={s.vacantUnits} icon="key-outline" tone="warning" />
          </View>

          <SectionHeader title="Rent this month" />
          <Card>
            <View style={styles.money}>
              <Money label="Expected" value={s.expectedRent} />
              <Money label="Collected" value={s.collected} color={colors.success} />
              <Money label="Outstanding" value={s.outstanding} color={colors.danger} />
            </View>
            <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
              <SegmentedBar segments={[{ value: s.collected, color: colors.success }, { value: s.outstanding, color: colors.border }]} height={12} />
              <AppText variant="caption" color={colors.textMuted}>{collectedPct}% of expected rent collected</AppText>
            </View>
          </Card>

          <SectionHeader title="Quick actions" />
          <View style={styles.actions}>
            {ACTIONS.map((a) => (
              <Pressable key={a.label} onPress={() => router.push(a.href)} accessibilityRole="button" accessibilityLabel={a.label} style={({ pressed }) => [styles.action, pressed && { opacity: 0.8 }]}>
                <View style={styles.actionIcon}><Icon name={a.icon} size={22} color={colors.primary} /></View>
                <AppText variant="caption" align="center" style={{ fontWeight: '600' }}>{a.label}</AppText>
              </Pressable>
            ))}
          </View>

          <SectionHeader title="Rent status" actionLabel="Rent overview" onAction={() => router.push('/landlord/rent')} />
          <RentStatusCard counts={s.rentStatus} />

          <SectionHeader title="Recent activity" />
          <Card>{data.activity.map((e) => <ActivityItem key={e.id} event={e} />)}</Card>
        </>
      )}
    </ScreenContainer>
  );
}

function Money({ label, value, color = colors.text }: { label: string; value: number; color?: string }) {
  return (
    <View style={{ flex: 1 }} accessible accessibilityLabel={`${label}: ${formatMoney(value)}`}>
      <AppText variant="caption" color={colors.textMuted}>{label}</AppText>
      <AppText variant="bodyStrong" color={color} adjustsFontSizeToFit numberOfLines={1}>{formatMoney(value)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
  money: { flexDirection: 'row', gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1, alignItems: 'center', gap: spacing.sm, padding: spacing.md, minHeight: 88, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  actionIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});

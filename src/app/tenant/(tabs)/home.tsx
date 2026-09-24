import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { ActivityItem } from '@/components/cards/ActivityItem';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { IconButton } from '@/components/ui/IconButton';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { LogoMark } from '@/components/ui/Logo';
import { QuickActions } from '@/components/ui/QuickActions';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetaBadge } from '@/components/ui/StatusBadge';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatDate, formatMoney, formatPeriod, greeting } from '@/lib/utils/format';
import { paymentStatusMeta } from '@/lib/utils/status';
import { getTenantHome } from '@/services/tenant';

export default function TenantHomeScreen() {
  const router = useRouter();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`tenant-home-${tenantId}`, () => getTenantHome(tenantId));

  const header = (
    <View style={styles.header}>
      <LogoMark size={40} />
      <View style={{ flex: 1 }}>
        <AppText variant="caption" color={colors.textMuted}>{greeting()},</AppText>
        <AppText variant="title" numberOfLines={1}>{user?.fullName.split(' ')[0]}</AppText>
      </View>
      <IconButton icon="notifications-outline" label="Notices" onPress={() => router.push('/tenant/notices')} />
    </View>
  );

  return (
    <ScreenContainer hasTabBar header={header} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : loading && !data ? <LoadingState label="Loading your home..." /> : !data ? (
        <EmptyState icon="home-outline" title="No active tenancy" message="Once your landlord assigns you to a unit, your home will appear here." />
      ) : (
        <>
          <SectionHeader title="My home" />
          <Card>
            <AppText variant="heading">{data.tenancy.property.name}</AppText>
            <AppText variant="caption" color={colors.textMuted} style={{ marginBottom: spacing.sm }}>
              {data.tenancy.property.location.area}, {data.tenancy.property.location.city}
            </AppText>
            <InfoRow label="Unit" value={data.tenancy.unit.unitNumber} />
            <InfoRow label="Landlord" value={data.tenancy.landlord.fullName} />
            {data.tenancy.manager ? <InfoRow label="Property manager" value={data.tenancy.manager.fullName} /> : null}
            <InfoRow label="Lease ends" value={formatDate(data.tenancy.lease.endDate)} />
          </Card>

          <SectionHeader title="Rent status" />
          <Card>
            <View style={styles.rentTop}>
              <View style={{ flex: 1 }}>
                <AppText variant="caption" color={colors.textMuted}>Current rent{data.current ? ` · ${formatPeriod(data.current.period)}` : ''}</AppText>
                <AppText variant="display">{formatMoney(data.tenancy.unit.monthlyRent)}</AppText>
              </View>
              {data.current ? <MetaBadge meta={paymentStatusMeta[data.current.status]} /> : null}
            </View>
            {data.current ? <InfoRow label="Due date" value={formatDate(data.current.dueDate)} /> : null}
            <InfoRow label="Outstanding balance" value={formatMoney(data.balance)} />
            {data.current && data.current.status !== 'paid' ? (
              <View style={{ marginTop: spacing.md }}><Button label="Pay rent" icon="card-outline" onPress={() => router.push('/tenant/pay')} /></View>
            ) : null}
          </Card>

          <SectionHeader title="Quick actions" />
          <QuickActions actions={[
            { label: 'Pay Rent', icon: 'card-outline', onPress: () => router.push('/tenant/pay') },
            { label: 'Report Issue', icon: 'construct-outline', onPress: () => router.push('/tenant/report-issue') },
            { label: 'View Receipt', icon: 'receipt-outline', onPress: () => router.push(data.latestReceiptId ? `/tenant/receipt/${data.latestReceiptId}` : '/tenant/payments') },
            { label: 'Contact Landlord', icon: 'chatbubble-ellipses-outline', onPress: () => router.push(data.conversationIds.landlord ? `/tenant/chat/${data.conversationIds.landlord}` : '/tenant/messages') },
          ]} />

          <SectionHeader title="Recent activity" actionLabel="Notices" onAction={() => router.push('/tenant/notices')} />
          <Card>{data.activity.map((e) => <ActivityItem key={e.id} event={e} />)}</Card>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  rentTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm },
});

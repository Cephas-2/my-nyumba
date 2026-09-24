import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { PaymentCard } from '@/components/cards/PaymentCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatDate, formatMoney, formatPeriod } from '@/lib/utils/format';
import { paymentMethodLabel } from '@/lib/utils/meta';
import { getPaymentsSummary } from '@/services/tenant';

export default function TenantPaymentsScreen() {
  const router = useRouter();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`tenant-payments-${tenantId}`, () => getPaymentsSummary(tenantId));

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="Payments" />} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : loading && !data ? <LoadingState /> : !data ? (
        <EmptyState icon="wallet-outline" title="No payments yet" message="Your rent payments will appear here." />
      ) : (
        <>
          <Card>
            <AppText variant="caption" color={colors.textMuted}>Current balance</AppText>
            <AppText variant="display" color={data.balance > 0 ? colors.danger : colors.success}>{formatMoney(data.balance)}</AppText>
            <AppText color={colors.textMuted}>{data.balance > 0 ? 'This amount is overdue or partly unpaid.' : 'You are all paid up. Thank you!'}</AppText>
          </Card>

          <SectionHeader title="Next payment" />
          <Card>
            <InfoRow label="Amount" value={formatMoney(data.nextAmount)} />
            <InfoRow label="Due date" value={formatDate(data.nextDueDate)} />
            <View style={{ marginTop: spacing.md }}><Button label="Make a payment" icon="card-outline" onPress={() => router.push('/tenant/pay')} /></View>
          </Card>

          <SectionHeader title="Payment history" actionLabel="See all" onAction={() => router.push('/tenant/payment-history')} />
          <View style={{ gap: spacing.md }}>
            {data.payments.slice(0, 3).map((p) => (
              <PaymentCard key={p.id} payment={p} title={formatPeriod(p.period)} subtitle={p.method ? `${paymentMethodLabel[p.method]}${p.reference ? ' · ' + p.reference : ''}` : undefined} onPress={() => router.push(`/tenant/receipt/${p.id}`)} />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

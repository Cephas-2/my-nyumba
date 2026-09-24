import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { PaymentCard } from '@/components/cards/PaymentCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatPeriod } from '@/lib/utils/format';
import { paymentMethodLabel } from '@/lib/utils/meta';
import { paymentStatusMeta } from '@/lib/utils/status';
import { getPaymentsSummary } from '@/services/tenant';
import type { PaymentStatus } from '@/types';

type Filter = 'all' | PaymentStatus;
const FILTERS: Filter[] = ['all', 'paid', 'partial', 'pending', 'overdue'];

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, error, refetch } = useMockQuery(`tenant-history-${tenantId}`, () => getPaymentsSummary(tenantId));
  const [filter, setFilter] = useState<Filter>('all');
  const visible = (data?.payments ?? []).filter((p) => filter === 'all' || p.status === filter);

  return (
    <ScreenContainer header={<AppHeader title="Payment history" showBack />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
        {FILTERS.map((f) => <FilterButton key={f} label={f === 'all' ? 'All' : paymentStatusMeta[f].label} selected={filter === f} onPress={() => setFilter(f)} />)}
      </ScrollView>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : visible.length === 0 ? (
        <EmptyState icon="receipt-outline" title="No payments here" message="Nothing matches this filter." />
      ) : (
        <View style={{ gap: spacing.md }}>
          {visible.map((p) => (
            <PaymentCard key={p.id} payment={p} title={formatPeriod(p.period)} subtitle={p.method ? `${paymentMethodLabel[p.method]}${p.reference ? ' · ' + p.reference : ''}` : undefined} onPress={() => router.push(`/tenant/receipt/${p.id}`)} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { MetaBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatMoney } from '@/lib/utils/format';
import { paymentStatusMeta } from '@/lib/utils/status';
import type { Payment } from '@/types';

interface Props { payment: Payment; title: string; subtitle?: string; onPress?: () => void }

export function PaymentCard({ payment, title, subtitle, onPress }: Props) {
  const date = payment.paidDate ? `Paid ${formatDate(payment.paidDate)}` : `Due ${formatDate(payment.dueDate)}`;
  return (
    <Card onPress={onPress} accessibilityLabel={`${title}, ${formatMoney(payment.amount)}, ${paymentStatusMeta[payment.status].label}`}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>{title}</AppText>
          {subtitle ? <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>{subtitle}</AppText> : null}
          <AppText variant="caption" color={colors.textMuted}>{date}</AppText>
        </View>
        <View style={styles.right}>
          <AppText variant="bodyStrong">{formatMoney(payment.status === 'paid' || payment.status === 'partial' ? payment.amount : payment.expectedAmount)}</AppText>
          <MetaBadge meta={paymentStatusMeta[payment.status]} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  right: { alignItems: 'flex-end', gap: spacing.xs },
});

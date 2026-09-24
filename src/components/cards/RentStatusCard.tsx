import { StyleSheet, View } from 'react-native';
import { colors, spacing, toneColors } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { SegmentedBar } from '@/components/ui/SegmentedBar';
import { paymentStatusMeta } from '@/lib/utils/status';
import type { RentStatusCounts } from '@/services/landlord';
import type { PaymentStatus } from '@/types';

const ORDER: PaymentStatus[] = ['paid', 'partial', 'pending', 'overdue'];

export function RentStatusCard({ counts }: { counts: RentStatusCounts }) {
  return (
    <Card>
      <SegmentedBar segments={ORDER.map((s) => ({ value: counts[s], color: toneColors[paymentStatusMeta[s].tone].fg }))} height={12} />
      <View style={styles.legend}>
        {ORDER.map((s) => {
          const meta = paymentStatusMeta[s];
          return (
            <View key={s} style={styles.item} accessible accessibilityLabel={`${meta.label}: ${counts[s]} units`}>
              <Icon name={meta.icon} size={16} color={toneColors[meta.tone].fg} />
              <AppText variant="body">{meta.label}</AppText>
              <AppText variant="bodyStrong" style={{ marginLeft: 'auto' }}>{counts[s]}</AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  legend: { marginTop: spacing.lg, gap: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, paddingBottom: spacing.sm },
});

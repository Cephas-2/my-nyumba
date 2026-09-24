import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { MetaBadge } from '@/components/ui/StatusBadge';
import { formatMoney } from '@/lib/utils/format';
import { paymentStatusMeta, unitStatusMeta } from '@/lib/utils/status';
import type { UnitRecord } from '@/services/landlord';

export function UnitCard({ record, onPress }: { record: UnitRecord; onPress?: () => void }) {
  const { unit, tenant, payment } = record;
  return (
    <Card onPress={onPress} accessibilityLabel={`Unit ${unit.unitNumber}, ${unitStatusMeta[unit.status].label}`}>
      <View style={styles.top}>
        <View style={styles.unit}><AppText variant="heading" color={colors.primary}>{unit.unitNumber}</AppText></View>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>{tenant ? tenant.fullName : 'No tenant assigned'}</AppText>
          <AppText variant="caption" color={colors.textMuted}>{unit.bedrooms} bed · {formatMoney(unit.monthlyRent)} / month</AppText>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
      <View style={styles.badges}>
        <MetaBadge meta={unitStatusMeta[unit.status]} />
        {payment ? <MetaBadge meta={paymentStatusMeta[payment.status]} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  unit: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});

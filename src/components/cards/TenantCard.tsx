import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { MetaBadge } from '@/components/ui/StatusBadge';
import { leaseStatusMeta, paymentStatusMeta } from '@/lib/utils/status';
import type { TenantRecord } from '@/services/landlord';

export function TenantCard({ record, onPress }: { record: TenantRecord; onPress?: () => void }) {
  const { tenant, unit, property, lease, payment } = record;
  return (
    <Card onPress={onPress} accessibilityLabel={`${tenant.fullName}, unit ${unit.unitNumber}, ${property.name}`}>
      <View style={styles.top}>
        <Avatar name={tenant.fullName} />
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>{tenant.fullName}</AppText>
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>Unit {unit.unitNumber} · {property.name}</AppText>
        </View>
      </View>
      <View style={styles.badges}>
        {payment ? <MetaBadge meta={paymentStatusMeta[payment.status]} /> : null}
        <MetaBadge meta={leaseStatusMeta[lease.status]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});

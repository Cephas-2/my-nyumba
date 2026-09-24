import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { MetaBadge } from '@/components/ui/StatusBadge';
import { formatRelative } from '@/lib/utils/format';
import { maintenanceStatusMeta, priorityMeta } from '@/lib/utils/status';
import type { MaintenanceItem } from '@/services/landlord';

export function MaintenanceCard({ item, onPress }: { item: MaintenanceItem; onPress?: () => void }) {
  const { request, tenant, unit, property } = item;
  return (
    <Card onPress={onPress} accessibilityLabel={`${request.title}, ${priorityMeta[request.priority].label} priority`}>
      <AppText variant="bodyStrong" numberOfLines={2}>{request.title}</AppText>
      <AppText variant="caption" color={colors.textMuted} style={styles.sub}>
        {tenant ? `${tenant.fullName} · ` : ''}Unit {unit.unitNumber}, {property.name}
      </AppText>
      <View style={styles.badges}>
        <MetaBadge meta={priorityMeta[request.priority]} />
        <MetaBadge meta={maintenanceStatusMeta[request.status]} />
        <AppText variant="caption" color={colors.textMuted}>{formatRelative(request.createdAt)}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  sub: { marginTop: 2 },
  badges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});

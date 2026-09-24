import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { AdminProperty } from '@/services/admin';

export function AdminPropertyCard({ item, onPress }: { item: AdminProperty; onPress: () => void }) {
  const { property, owner, stats, flags } = item;
  return (
    <Card onPress={onPress} accessibilityLabel={`${property.name}, ${property.location.city}${flags.length ? ', flagged' : ''}`}>
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <AppText variant="heading" numberOfLines={1}>{property.name}</AppText>
          <AppText variant="caption" color={colors.textMuted}>{property.location.area}, {property.location.city}</AppText>
          <AppText variant="caption" color={colors.textMuted}>Owner: {owner?.fullName ?? 'Unknown'}</AppText>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
      <View style={styles.badges}>
        <StatusBadge label={`${stats.totalUnits} units`} tone="neutral" icon="grid-outline" />
        <StatusBadge label={`${stats.occupancyRate}% occupied`} tone="success" icon="person-outline" />
        {flags.length ? <StatusBadge label="Flagged" tone="danger" icon="flag" /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});

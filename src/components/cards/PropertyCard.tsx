import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { formatMoney } from '@/lib/utils/format';
import type { PropertyWithStats } from '@/services/landlord';

interface Props { item: PropertyWithStats; onView: () => void; onMore?: () => void }

export function PropertyCard({ item, onView, onMore }: Props) {
  const { property, stats } = item;
  return (
    <Card padded={false} accessibilityLabel={`${property.name}, ${property.location.area}`}>
      {/* TODO(supabase-storage): render property.imageUrl when photos are uploaded */}
      <View style={styles.banner}><Icon name="business" size={34} color={colors.primary} /></View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <AppText variant="heading" numberOfLines={1}>{property.name}</AppText>
            <View style={styles.loc}>
              <Icon name="location-outline" size={14} color={colors.textMuted} />
              <AppText variant="caption" color={colors.textMuted}>{property.location.area}, {property.location.city}</AppText>
            </View>
          </View>
          {onMore ? <IconButton icon="ellipsis-horizontal" label={`More actions for ${property.name}`} onPress={onMore} /> : null}
        </View>
        <View style={styles.metrics}>
          <Metric label="Units" value={stats.totalUnits} />
          <Metric label="Occupied" value={stats.occupied} />
          <Metric label="Vacant" value={stats.vacant} />
        </View>
        <View style={styles.footer}>
          <View>
            <AppText variant="caption" color={colors.textMuted}>Monthly expected rent</AppText>
            <AppText variant="bodyStrong">{formatMoney(stats.expectedRent)}</AppText>
          </View>
          <Button label="View" onPress={onView} size="sm" fullWidth={false} icon="arrow-forward" />
        </View>
      </View>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metric} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="title">{value}</AppText>
      <AppText variant="caption" color={colors.textMuted}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { height: 84, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  body: { padding: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metrics: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md },
  metric: { flex: 1, alignItems: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

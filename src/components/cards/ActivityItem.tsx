import { StyleSheet, View } from 'react-native';
import { colors, spacing, toneColors, type Tone } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';
import { formatRelative } from '@/lib/utils/format';
import type { ActivityEvent, NotificationType } from '@/types';

const META: Record<NotificationType, { icon: IconName; tone: Tone }> = {
  payment: { icon: 'cash-outline', tone: 'success' },
  maintenance: { icon: 'construct-outline', tone: 'warning' },
  tenant: { icon: 'person-add-outline', tone: 'primary' },
  unit: { icon: 'key-outline', tone: 'info' },
  notice: { icon: 'megaphone-outline', tone: 'neutral' },
};

export function ActivityItem({ event }: { event: ActivityEvent }) {
  const m = META[event.type];
  const c = toneColors[m.tone];
  return (
    <View style={styles.row} accessible accessibilityLabel={`${event.title}. ${event.description}. ${formatRelative(event.createdAt)}`}>
      <View style={[styles.icon, { backgroundColor: c.bg }]}><Icon name={m.icon} size={18} color={c.fg} /></View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{event.title}</AppText>
        <AppText variant="caption" color={colors.textMuted}>{event.description}</AppText>
      </View>
      <AppText variant="caption" color={colors.textMuted}>{formatRelative(event.createdAt)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.sm },
  icon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});

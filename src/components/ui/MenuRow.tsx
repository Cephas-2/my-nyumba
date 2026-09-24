import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

interface Props {
  icon: IconName; label: string; onPress: () => void;
  subtitle?: string; badge?: number; destructive?: boolean;
}

export function MenuRow({ icon, label, onPress, subtitle, badge, destructive }: Props) {
  const fg = destructive ? colors.danger : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, ${badge} unread` : label}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.neutralSoft }]}
    >
      <View style={[styles.icon, { backgroundColor: destructive ? colors.dangerSoft : colors.primarySoft }]}>
        <Icon name={icon} size={20} color={destructive ? colors.danger : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong" color={fg}>{label}</AppText>
        {subtitle ? <AppText variant="caption" color={colors.textMuted}>{subtitle}</AppText> : null}
      </View>
      {badge ? (
        <View style={styles.badge}><AppText variant="label" color={colors.textOnPrimary}>{badge}</AppText></View>
      ) : null}
      {!destructive ? <Icon name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 60, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  icon: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  badge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
});

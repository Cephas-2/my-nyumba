import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

interface Action { label: string; icon: IconName; onPress: () => void }

export function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <View style={styles.row}>
      {actions.map((a) => (
        <Pressable key={a.label} onPress={a.onPress} accessibilityRole="button" accessibilityLabel={a.label} style={({ pressed }) => [styles.action, pressed && { opacity: 0.8 }]}>
          <View style={styles.icon}><Icon name={a.icon} size={22} color={colors.primary} /></View>
          <AppText variant="caption" align="center" style={{ fontWeight: '600' }}>{a.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  action: { flex: 1, alignItems: 'center', gap: spacing.sm, padding: spacing.md, minHeight: 88, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});

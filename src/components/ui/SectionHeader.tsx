import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';

interface Props { title: string; actionLabel?: string; onAction?: () => void }

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant="heading" accessibilityRole="header">{title}</AppText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button" accessibilityLabel={actionLabel} style={styles.action}>
          <AppText variant="label" color={colors.primary}>{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.md },
  action: { minHeight: 32, justifyContent: 'center' },
});

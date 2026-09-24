import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="body" color={colors.textMuted}>{label}</AppText>
      <AppText variant="bodyStrong" style={styles.value}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg, paddingVertical: spacing.sm },
  value: { flexShrink: 1, textAlign: 'right' },
});

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText color={colors.textMuted}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl } });

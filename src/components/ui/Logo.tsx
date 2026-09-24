import { StyleSheet, View } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

// Temporary mark: replace this component when the real logo is ready.
export function LogoMark({ size = 44, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <View
      accessible
      accessibilityLabel={`${APP_CONFIG.name} logo`}
      style={[styles.mark, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: inverse ? colors.surface : colors.primary }]}
    >
      <Icon name="home" size={size * 0.55} color={inverse ? colors.primary : colors.textOnPrimary} />
      <View style={[styles.dot, { width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1, top: size * 0.14, right: size * 0.14 }]} />
    </View>
  );
}

export function Logo({ size = 44, inverse = false }: { size?: number; inverse?: boolean }) {
  return (
    <View style={styles.row}>
      <LogoMark size={size} inverse={inverse} />
      <AppText variant="title" color={inverse ? colors.textOnPrimary : colors.text}>{APP_CONFIG.name}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  mark: { alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', backgroundColor: colors.accent },
});

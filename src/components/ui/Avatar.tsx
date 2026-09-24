import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';
import { initials } from '@/lib/utils/format';
import { AppText } from './AppText';

const PALETTE = [
  { bg: colors.primarySoft, fg: colors.primary },
  { bg: colors.infoSoft, fg: colors.info },
  { bg: colors.accentSoft, fg: colors.warning },
  { bg: colors.successSoft, fg: colors.success },
  { bg: colors.neutralSoft, fg: colors.neutral },
];

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const hash = name.split('').reduce((h, c) => h + c.charCodeAt(0), 0);
  const c = PALETTE[hash % PALETTE.length];
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: c.bg }]} accessibilityLabel={`Avatar for ${name}`}>
      <AppText variant="label" color={c.fg} style={{ fontSize: size * 0.34 }}>{initials(name)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center' } });

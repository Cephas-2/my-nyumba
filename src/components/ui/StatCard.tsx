import { StyleSheet, View } from 'react-native';
import { colors, spacing, toneColors, type Tone } from '@/constants/theme';
import { AppText } from './AppText';
import { Card } from './Card';
import { Icon, type IconName } from './Icon';

interface Props { label: string; value: string | number; icon: IconName; tone?: Tone; helper?: string }

export function StatCard({ label, value, icon, tone = 'primary', helper }: Props) {
  const c = toneColors[tone];
  return (
    <Card style={styles.card} accessibilityLabel={`${label}: ${value}`}>
      <View style={[styles.icon, { backgroundColor: c.bg }]}><Icon name={icon} size={18} color={c.fg} /></View>
      <AppText variant="title" style={styles.value}>{value}</AppText>
      <AppText variant="caption" color={colors.textMuted}>{label}</AppText>
      {helper ? <AppText variant="caption" color={c.fg}>{helper}</AppText> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexBasis: '47%', flexGrow: 1, gap: 2 },
  icon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  value: { marginTop: 2 },
});

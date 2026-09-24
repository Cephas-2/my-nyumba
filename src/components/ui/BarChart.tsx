import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export interface BarDatum { label: string; value: number }

export function BarChart({ data, height = 130, color = colors.primary }: { data: BarDatum[]; height?: number; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={styles.chart} accessible accessibilityLabel={data.map((d) => `${d.label}: ${d.value}`).join(', ')}>
      {data.map((d) => (
        <View key={d.label} style={styles.col}>
          <AppText variant="caption" color={colors.textMuted}>{d.value}</AppText>
          <View style={[styles.bar, { height: Math.max(4, (d.value / max) * height), backgroundColor: color }]} />
          <AppText variant="caption" color={colors.textMuted}>{d.label}</AppText>
        </View>
      ))}
    </View>
  );
}

export function HorizontalBars({ data, color = colors.primary }: { data: BarDatum[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={{ gap: spacing.md }}>
      {data.map((d) => (
        <View key={d.label} accessible accessibilityLabel={`${d.label}: ${d.value}`} style={{ gap: 4 }}>
          <View style={styles.hRow}>
            <AppText variant="body">{d.label}</AppText>
            <AppText variant="bodyStrong">{d.value}</AppText>
          </View>
          <View style={styles.track}><View style={[styles.fill, { width: `${Math.round((d.value / max) * 100)}%`, backgroundColor: color }]} /></View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '70%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  hRow: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.neutralSoft, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
});

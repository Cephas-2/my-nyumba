import { StyleSheet, View } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface Segment { value: number; color: string }

// Simple proportional bar. Always pair it with a text legend (see RentStatusCard).
export function SegmentedBar({ segments, height = 10 }: { segments: Segment[]; height?: number }) {
  const visible = segments.filter((s) => s.value > 0);
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {visible.map((s, i) => <View key={i} style={{ flex: s.value, backgroundColor: s.color }} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', overflow: 'hidden', backgroundColor: colors.neutralSoft, borderRadius: radius.pill },
});

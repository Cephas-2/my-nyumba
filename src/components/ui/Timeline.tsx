import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { formatRelative } from '@/lib/utils/format';
import type { TimelineEntry } from '@/types';
import { AppText } from './AppText';
import { Icon } from './Icon';

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <View>
      {entries.map((e, i) => (
        <View key={e.id} style={styles.row} accessible accessibilityLabel={`${e.title}, ${e.done ? 'done' : 'not yet'}`}>
          <View style={styles.rail}>
            <View style={[styles.dot, e.done ? styles.dotDone : styles.dotTodo]}>
              {e.done ? <Icon name="checkmark" size={13} color={colors.textOnPrimary} /> : null}
            </View>
            {i < entries.length - 1 ? <View style={[styles.line, e.done && styles.lineDone]} /> : null}
          </View>
          <View style={styles.text}>
            <AppText variant="bodyStrong" color={e.done ? colors.text : colors.textMuted}>{e.title}</AppText>
            {e.description ? <AppText variant="caption" color={colors.textMuted}>{e.description}</AppText> : null}
            {e.at ? <AppText variant="caption" color={colors.textMuted}>{formatRelative(e.at)}</AppText> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', width: 22 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotTodo: { backgroundColor: colors.surface, borderColor: colors.border },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.success },
  text: { flex: 1, paddingBottom: spacing.lg, gap: 2 },
});

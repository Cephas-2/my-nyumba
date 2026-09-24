import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';

interface Props { label: string; selected: boolean; onPress: () => void; count?: number }

export function FilterButton({ label, selected, onPress, count }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={count !== undefined ? `${label}, ${count}` : label}
      style={[styles.pill, selected && styles.selected]}
    >
      <AppText variant="label" color={selected ? colors.textOnPrimary : colors.text}>
        {count !== undefined ? `${label} (${count})` : label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { minHeight: 40, paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
});

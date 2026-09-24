import { StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { FilterButton } from '@/components/ui/FilterButton';

interface Option<T extends string> { label: string; value: T }
interface Props<T extends string> { label?: string; options: Option<T>[]; value: T; onChange: (v: T) => void }

export function ChoiceGroup<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <View style={styles.row}>
        {options.map((o) => <FilterButton key={o.value} label={o.label} selected={o.value === value} onPress={() => onChange(o.value)} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, marginBottom: spacing.lg },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});

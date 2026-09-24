import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';

interface Props { value: string; onChangeText: (t: string) => void; placeholder?: string }

export function SearchBar({ value, onChangeText, placeholder = 'Search' }: Props) {
  return (
    <View style={styles.box}>
      <Icon name="search" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        style={styles.input}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
          <Icon name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: spacing.sm },
});

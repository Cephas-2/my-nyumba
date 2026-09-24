import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';

interface Props { value: string; onChange: (v: string) => void; length?: number }

// One real TextInput (good for autofill and screen readers) with decorative boxes on top.
export function CodeInput({ value, onChange, length = 6 }: Props) {
  const ref = useRef<TextInput>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityRole="none">
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => (
          <View key={i} style={[styles.box, i === value.length && styles.active]}>
            <AppText variant="title">{value[i] ?? ''}</AppText>
          </View>
        ))}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        textContentType="oneTimeCode"
        accessibilityLabel={`${length}-digit verification code`}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  box: { flex: 1, height: 58, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  active: { borderColor: colors.primary, borderWidth: 2 },
  hidden: { position: 'absolute', width: '100%', height: '100%', opacity: 0 },
});

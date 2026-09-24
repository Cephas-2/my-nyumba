import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Icon, type IconName } from '@/components/ui/Icon';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  helper?: string;
  leftIcon?: IconName;
  isPassword?: boolean;
}

export function TextField({ label, error, helper, leftIcon, isPassword, multiline, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  return (
    <View style={styles.wrap}>
      <AppText variant="label" style={styles.label}>{label}</AppText>
      <View style={[styles.box, multiline && styles.multiline, focused && styles.focused, !!error && styles.errorBox]}>
        {leftIcon ? <Icon name={leftIcon} size={20} color={colors.textMuted} /> : null}
        <TextInput
          {...rest}
          multiline={multiline}
          secureTextEntry={isPassword && hidden}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          accessibilityLabel={label}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, multiline && { textAlignVertical: 'top' }, style]}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <AppText variant="caption" color={colors.danger} accessibilityRole="alert">{error}</AppText> : helper ? <AppText variant="caption" color={colors.textMuted}>{helper}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs, marginBottom: spacing.lg },
  label: { color: colors.text },
  box: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 52, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  multiline: { alignItems: 'flex-start', minHeight: 100, paddingVertical: spacing.sm },
  focused: { borderColor: colors.primary, borderWidth: 2 },
  errorBox: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: spacing.sm },
});

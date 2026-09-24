import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'md' | 'sm';
  accessibilityHint?: string;
}

const palette: Record<Variant, { bg: string; fg: string; border: string; pressed: string }> = {
  primary: { bg: colors.primary, fg: colors.textOnPrimary, border: colors.primary, pressed: colors.primaryPressed },
  secondary: { bg: colors.surface, fg: colors.primary, border: colors.primary, pressed: colors.primarySoft },
  danger: { bg: colors.danger, fg: colors.textOnPrimary, border: colors.danger, pressed: '#8F1F19' },
  ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent', pressed: colors.primarySoft },
};

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, fullWidth = true, size = 'md', accessibilityHint }: ButtonProps) {
  const p = palette[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: pressed ? p.pressed : p.bg, borderColor: p.border },
        fullWidth ? styles.full : styles.auto,
        inactive && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={p.fg} /> : null}
          <AppText variant="bodyStrong" color={p.fg}>{label}</AppText>
        </View>
      )}
    </Pressable>
  );
}

export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => <Button {...props} variant="primary" />;
export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => <Button {...props} variant="secondary" />;

const styles = StyleSheet.create({
  base: { borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  md: { minHeight: 52 },
  sm: { minHeight: 44 },
  full: { alignSelf: 'stretch' },
  auto: { alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  disabled: { opacity: 0.5 },
});

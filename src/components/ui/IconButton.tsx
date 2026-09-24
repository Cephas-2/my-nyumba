import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants/theme';
import { Icon, type IconName } from './Icon';

interface Props { icon: IconName; label: string; onPress: () => void; filled?: boolean }

export function IconButton({ icon, label, onPress, filled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => [styles.btn, filled && styles.filled, pressed && { opacity: 0.7 }]}
    >
      <Icon name={icon} size={22} color={filled ? colors.textOnPrimary : colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  filled: { backgroundColor: colors.primary },
});

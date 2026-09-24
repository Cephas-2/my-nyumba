import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

interface Props { icon?: IconName; title: string; message?: string; actionLabel?: string; onAction?: () => void }

export function EmptyState({ icon = 'file-tray-outline', title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}><Icon name={icon} size={30} color={colors.primary} /></View>
      <AppText variant="heading" align="center">{title}</AppText>
      {message ? <AppText color={colors.textMuted} align="center">{message}</AppText> : null}
      {actionLabel && onAction ? <View style={{ marginTop: spacing.md }}><Button label={actionLabel} onPress={onAction} fullWidth={false} /></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
});

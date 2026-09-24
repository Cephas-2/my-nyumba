import { StyleSheet, View } from 'react-native';
import { colors, spacing, toneColors, type Tone } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatRelative } from '@/lib/utils/format';

interface Props {
  title: string; body: string; createdAt: string; icon: IconName; tone: Tone;
  label?: string; unread?: boolean; onPress?: () => void;
}

export function NotificationItem({ title, body, createdAt, icon, tone, label, unread, onPress }: Props) {
  const c = toneColors[tone];
  return (
    <Card onPress={onPress} accessibilityLabel={`${unread ? 'New. ' : ''}${label ? label + '. ' : ''}${title}. ${body}`}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: c.bg }]}><Icon name={icon} size={20} color={c.fg} /></View>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="bodyStrong">{title}{unread ? '  •' : ''}</AppText>
          <AppText color={colors.textMuted}>{body}</AppText>
          <View style={styles.footer}>
            {label ? <StatusBadge label={label} tone={tone} /> : null}
            <AppText variant="caption" color={colors.textMuted}>{formatRelative(createdAt)}</AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
});

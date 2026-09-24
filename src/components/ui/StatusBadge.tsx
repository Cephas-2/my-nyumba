import { StyleSheet, View } from 'react-native';
import { radius, spacing, toneColors, type Tone } from '@/constants/theme';
import type { StatusMeta } from '@/lib/utils/status';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

interface Props { label: string; tone: Tone; icon?: IconName }

// Always shows text (and usually an icon) so status is never conveyed by colour alone.
export function StatusBadge({ label, tone, icon }: Props) {
  const c = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]} accessible accessibilityLabel={`Status: ${label}`}>
      {icon ? <Icon name={icon} size={13} color={c.fg} /> : null}
      <AppText variant="label" color={c.fg}>{label}</AppText>
    </View>
  );
}

export const MetaBadge = ({ meta }: { meta: StatusMeta }) => <StatusBadge label={meta.label} tone={meta.tone} icon={meta.icon} />;

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
});

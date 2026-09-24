import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { formatMessageTime } from '@/lib/utils/format';
import type { Message } from '@/types';

export function MessageBubble({ message, own }: { message: Message; own: boolean }) {
  const fg = own ? colors.textOnPrimary : colors.text;
  return (
    <View style={[styles.wrap, own ? styles.right : styles.left]} accessible accessibilityLabel={`${own ? 'You' : 'They'} said: ${message.body}. ${formatMessageTime(message.sentAt)}`}>
      <View style={[styles.bubble, own ? styles.own : styles.other]}>
        {message.attachmentName ? (
          <View style={styles.attach}>
            <Icon name="attach" size={16} color={fg} />
            <AppText variant="label" color={fg}>{message.attachmentName}</AppText>
          </View>
        ) : null}
        <AppText color={fg}>{message.body}</AppText>
      </View>
      <AppText variant="caption" color={colors.textMuted} style={styles.time}>{formatMessageTime(message.sentAt)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { maxWidth: '82%', marginBottom: spacing.md },
  right: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  left: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, borderRadius: radius.lg, gap: 4 },
  own: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  other: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  attach: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  time: { marginTop: 2 },
});

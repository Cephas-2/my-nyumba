import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { formatRelative } from '@/lib/utils/format';
import { roleMeta } from '@/lib/utils/meta';
import type { ConversationRow } from '@/services/messaging';

export function ConversationCard({ row, onPress }: { row: ConversationRow; onPress: () => void }) {
  const { conversation, other } = row;
  const unread = conversation.unreadCount;
  return (
    <Card onPress={onPress} accessibilityLabel={`${other.fullName}, ${roleMeta[other.role].label}. ${unread ? unread + ' unread. ' : ''}${conversation.lastMessage}`}>
      <View style={styles.row}>
        <Avatar name={other.fullName} size={48} />
        <View style={{ flex: 1 }}>
          <View style={styles.top}>
            <AppText variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>{other.fullName}</AppText>
            <AppText variant="caption" color={colors.textMuted}>{formatRelative(conversation.lastMessageAt)}</AppText>
          </View>
          <AppText variant="caption" color={colors.primary}>{roleMeta[other.role].label}</AppText>
          <AppText color={unread ? colors.text : colors.textMuted} numberOfLines={1} style={unread ? { fontWeight: '600' } : undefined}>{conversation.lastMessage}</AppText>
        </View>
        {unread ? <View style={styles.badge}><AppText variant="label" color={colors.textOnPrimary}>{unread}</AppText></View> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
});

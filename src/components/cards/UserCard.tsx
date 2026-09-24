import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { MetaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { accountStatusMeta, roleMeta } from '@/lib/utils/meta';
import type { User } from '@/types';

export function UserCard({ user, onPress }: { user: User; onPress?: () => void }) {
  const role = roleMeta[user.role];
  return (
    <Card onPress={onPress} accessibilityLabel={`${user.fullName}, ${role.label}, ${accountStatusMeta[user.status].label}`}>
      <View style={styles.top}>
        <Avatar name={user.fullName} />
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" numberOfLines={1}>{user.fullName}</AppText>
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>{user.email}</AppText>
        </View>
      </View>
      <View style={styles.badges}>
        <StatusBadge label={role.label} tone={role.tone} icon={role.icon} />
        <MetaBadge meta={accountStatusMeta[user.status]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});

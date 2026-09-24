import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { MenuRow } from '@/components/ui/MenuRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSession } from '@/hooks/useSession';

export default function AdminMoreScreen() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [confirm, setConfirm] = useState(false);
  const go = (path: string) => () => router.push(path);

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="More" />}>
      <Card onPress={go('/admin/settings/profile')} accessibilityLabel="Open your profile">
        <View style={styles.profile}>
          <Avatar name={user?.fullName ?? 'Admin'} size={56} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{user?.fullName}</AppText>
            <AppText variant="caption" color={colors.textMuted}>{user?.email}</AppText>
            <AppText variant="caption" color={colors.danger}>Platform administrator</AppText>
          </View>
        </View>
      </Card>

      <SectionHeader title="Platform" />
      <Card padded={false}>
        <MenuRow icon="bar-chart-outline" label="Reports" subtitle="Platform statistics" onPress={go('/admin/reports')} />
        <MenuRow icon="options-outline" label="Platform settings" onPress={go('/admin/settings')} />
      </Card>

      <SectionHeader title="Account" />
      <Card padded={false}>
        <MenuRow icon="notifications-outline" label="Notifications" onPress={go('/admin/settings/notifications')} />
        <MenuRow icon="shield-checkmark-outline" label="Security" onPress={go('/admin/settings/security')} />
        <MenuRow icon="help-circle-outline" label="Help & Support" onPress={go('/admin/settings/help')} />
        <MenuRow icon="log-out-outline" label="Log out" destructive onPress={() => setConfirm(true)} />
      </Card>

      <ConfirmationModal
        visible={confirm} destructive title="Log out?" message="You will need to sign in again to use the admin tools."
        confirmLabel="Log out" onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); signOut(); router.replace('/sign-in'); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md } });

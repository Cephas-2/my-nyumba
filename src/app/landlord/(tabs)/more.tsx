import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { MenuRow } from '@/components/ui/MenuRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useSession } from '@/hooks/useSession';
import { getUnreadMessageCount } from '@/services/landlord';

export default function MoreScreen() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const go = (path: string) => () => router.push(path);

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="More" />}>
      <Card onPress={go('/landlord/settings/profile')} accessibilityLabel="Open your profile">
        <View style={styles.profile}>
          <Avatar name={user?.fullName ?? 'Landlord'} size={56} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{user?.fullName}</AppText>
            <AppText variant="caption" color={colors.textMuted}>{user?.email}</AppText>
            <AppText variant="caption" color={colors.primary}>Landlord</AppText>
          </View>
        </View>
      </Card>

      <SectionHeader title="Rent" />
      <Card padded={false}>
        <MenuRow icon="wallet-outline" label="Rent overview" subtitle="Expected, collected and outstanding" onPress={go('/landlord/rent')} />
        <MenuRow icon="receipt-outline" label="Payment history" onPress={go('/landlord/rent/history')} />
        <MenuRow icon="bar-chart-outline" label="Reports" onPress={go('/landlord/reports')} />
      </Card>

      <SectionHeader title="Communication" />
      <Card padded={false}>
        <MenuRow icon="chatbubbles-outline" label="Messages" badge={getUnreadMessageCount(user?.id ?? '')} onPress={go('/landlord/messages')} />
        <MenuRow icon="megaphone-outline" label="Notices" onPress={go('/landlord/notices')} />
        <MenuRow icon="document-text-outline" label="Documents" onPress={go('/landlord/documents')} />
      </Card>

      <SectionHeader title="Account" />
      <Card padded={false}>
        <MenuRow icon="settings-outline" label="Account settings" onPress={go('/landlord/settings')} />
        <MenuRow icon="notifications-outline" label="Notification settings" onPress={go('/landlord/settings/notifications')} />
        <MenuRow icon="shield-checkmark-outline" label="Security" onPress={go('/landlord/settings/security')} />
        <MenuRow icon="help-circle-outline" label="Help & Support" onPress={go('/landlord/settings/help')} />
        <MenuRow icon="lock-closed-outline" label="Privacy" onPress={go('/landlord/settings/privacy')} />
        <MenuRow icon="reader-outline" label="Terms" onPress={go('/landlord/settings/terms')} />
        <MenuRow icon="log-out-outline" label="Log out" destructive onPress={() => setConfirmLogout(true)} />
      </Card>

      <ConfirmationModal
        visible={confirmLogout}
        title="Log out of My Nyumba?"
        message="You will need to sign in again to see your properties."
        confirmLabel="Log out"
        destructive
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => { setConfirmLogout(false); signOut(); router.replace('/sign-in'); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md } });

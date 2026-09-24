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
import { getTenancy } from '@/services/tenant';

export default function TenantMoreScreen() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const tenancy = getTenancy(user?.id ?? '');
  const [confirm, setConfirm] = useState(false);
  const go = (path: string) => () => router.push(path);

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="More" />}>
      <Card onPress={go('/tenant/profile')} accessibilityLabel="Open your profile">
        <View style={styles.profile}>
          <Avatar name={user?.fullName ?? 'Tenant'} size={56} />
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{user?.fullName}</AppText>
            {tenancy ? <AppText variant="caption" color={colors.textMuted}>Unit {tenancy.unit.unitNumber} · {tenancy.property.name}</AppText> : null}
            <AppText variant="caption" color={colors.primary}>Tenant</AppText>
          </View>
        </View>
      </Card>

      <SectionHeader title="My rental" />
      <Card padded={false}>
        <MenuRow icon="document-text-outline" label="Documents" subtitle="Lease, receipts and notices" onPress={go('/tenant/documents')} />
        <MenuRow icon="megaphone-outline" label="Notices" subtitle="Announcements from your landlord" onPress={go('/tenant/notices')} />
        <MenuRow icon="receipt-outline" label="Payment history" onPress={go('/tenant/payment-history')} />
      </Card>

      <SectionHeader title="Account" />
      <Card padded={false}>
        <MenuRow icon="person-outline" label="Personal information" onPress={go('/tenant/profile')} />
        <MenuRow icon="settings-outline" label="Account settings" onPress={go('/tenant/settings/account')} />
        <MenuRow icon="notifications-outline" label="Notifications" onPress={go('/tenant/settings/notifications')} />
        <MenuRow icon="shield-checkmark-outline" label="Security" onPress={go('/tenant/settings/security')} />
        <MenuRow icon="help-circle-outline" label="Help & Support" onPress={go('/tenant/settings/help')} />
        <MenuRow icon="log-out-outline" label="Log out" destructive onPress={() => setConfirm(true)} />
      </Card>

      <ConfirmationModal
        visible={confirm} destructive title="Log out of My Nyumba?" message="You will need to sign in again to see your home."
        confirmLabel="Log out" onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); signOut(); router.replace('/sign-in'); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md } });

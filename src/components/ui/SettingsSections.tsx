import { useState } from 'react';
import { Alert, Linking, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from '@/constants/config';
import { colors, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useSession } from '@/hooks/useSession';
import { formatDate } from '@/lib/utils/format';
import { roleMeta } from '@/lib/utils/meta';
import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Card } from './Card';
import { ConfirmationModal } from './ConfirmationModal';
import { InfoRow } from './InfoRow';
import { MenuRow } from './MenuRow';
import { ScreenContainer } from './ScreenContainer';

const TITLES: Record<string, string> = {
  profile: 'Profile', account: 'Account settings', notifications: 'Notifications',
  security: 'Security', help: 'Help & Support', privacy: 'Privacy', terms: 'Terms of use',
};

// One screen for every role's settings pages. TODO(supabase): load/save real preferences per user.
export function SettingsSectionScreen({ section }: { section: string }) {
  const key = section in TITLES ? section : 'account';
  return (
    <ScreenContainer header={<AppHeader title={TITLES[key]} showBack />}>
      {key === 'profile' && <ProfileSection />}
      {key === 'account' && <AccountSection />}
      {key === 'notifications' && <NotificationsSection />}
      {key === 'security' && <SecuritySection />}
      {key === 'help' && <HelpSection />}
      {key === 'privacy' && <TextSection paragraphs={PRIVACY} />}
      {key === 'terms' && <TextSection paragraphs={TERMS} />}
    </ScreenContainer>
  );
}

function ProfileSection() {
  const { user } = useSession();
  if (!user) return null;
  return (
    <Card>
      <View style={styles.center}>
        <Avatar name={user.fullName} size={72} />
        <AppText variant="title">{user.fullName}</AppText>
        <AppText color={colors.primary} variant="bodyStrong">{roleMeta[user.role].label}</AppText>
      </View>
      <InfoRow label="Email" value={user.email} />
      <InfoRow label="Phone" value={user.phone} />
      <InfoRow label="Member since" value={formatDate(user.createdAt)} />
      <View style={{ marginTop: spacing.md }}>
        <Button label="Edit profile" variant="secondary" onPress={() => Alert.alert('Prototype', 'Profile editing will be saved to Supabase in the next phase.')} />
      </View>
    </Card>
  );
}

function AccountSection() {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Card>
        <InfoRow label="Language" value="English" />
        <InfoRow label="Currency" value={`${APP_CONFIG.currency.code} (${APP_CONFIG.currency.symbol})`} />
        <InfoRow label="Region" value="Kenya" />
      </Card>
      <View style={{ marginTop: spacing.xl }}>
        <Button label="Request account deletion" variant="danger" onPress={() => setConfirm(true)} />
      </View>
      <ConfirmationModal
        visible={confirm} destructive title="Request account deletion?"
        message="Our team will contact you to confirm before anything is removed. Prototype only: nothing will be sent."
        confirmLabel="Send request" onCancel={() => setConfirm(false)}
        onConfirm={() => { setConfirm(false); Alert.alert('Request noted', 'This is a prototype, so no request was sent.'); }}
      />
    </>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="caption" color={colors.textMuted}>{description}</AppText>
      </View>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} trackColor={{ true: colors.primary, false: colors.border }} />
    </View>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({ rent: true, payments: true, maintenance: true, messages: true, notices: true });
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v })); // TODO(expo-notifications)
  return (
    <Card>
      <ToggleRow label="Rent reminders" description="Before and after the due date" value={prefs.rent} onChange={set('rent')} />
      <ToggleRow label="Payments" description="When a payment is recorded or received" value={prefs.payments} onChange={set('payments')} />
      <ToggleRow label="Maintenance updates" description="When a request changes status" value={prefs.maintenance} onChange={set('maintenance')} />
      <ToggleRow label="Messages" description="New messages in your conversations" value={prefs.messages} onChange={set('messages')} />
      <ToggleRow label="Notices" description="Announcements and emergency notices" value={prefs.notices} onChange={set('notices')} />
    </Card>
  );
}

function SecuritySection() {
  const router = useRouter();
  const [twoStep, setTwoStep] = useState(false);
  return (
    <>
      <Card padded={false}>
        <MenuRow icon="key-outline" label="Change password" onPress={() => router.push('/forgot-password')} />
      </Card>
      <View style={{ height: spacing.lg }} />
      <Card>
        <ToggleRow label="Two-step verification" description="Ask for a code when you sign in on a new device" value={twoStep} onChange={setTwoStep} />
      </Card>
      <View style={{ height: spacing.lg }} />
      <Card>
        <AppText variant="heading" style={{ marginBottom: spacing.sm }}>Signed-in devices</AppText>
        <InfoRow label="This phone" value="Active now" />
      </Card>
    </>
  );
}

const FAQ = [
  { q: 'How do I pay my rent?', a: 'Open Payments, choose Pay rent and pick M-Pesa or bank transfer. Online payments are coming in a later release.' },
  { q: 'How do I report a problem in my home?', a: 'Go to Maintenance and tap the plus button. Describe the problem, choose a category and submit.' },
  { q: 'Where can I find my lease?', a: 'Open More, then Documents. Your lease and receipts are filed there.' },
  { q: 'I forgot my password', a: 'On the sign-in screen tap Forgot password and follow the steps.' },
];

function HelpSection() {
  return (
    <>
      <Card>
        <InfoRow label="Email" value={APP_CONFIG.supportEmail} />
        <InfoRow label="Phone" value={APP_CONFIG.supportPhone} />
        <View style={{ marginTop: spacing.md }}>
          <Button label="Email support" icon="mail-outline" onPress={() => Linking.openURL(`mailto:${APP_CONFIG.supportEmail}`)} />
        </View>
      </Card>
      <AppText variant="heading" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>Common questions</AppText>
      <View style={{ gap: spacing.md }}>
        {FAQ.map((f) => (
          <Card key={f.q}>
            <AppText variant="bodyStrong">{f.q}</AppText>
            <AppText color={colors.textMuted} style={{ marginTop: 4 }}>{f.a}</AppText>
          </Card>
        ))}
      </View>
    </>
  );
}

const PRIVACY = [
  'My Nyumba keeps the information needed to run your rental: your name, contact details, lease, rent payments and maintenance requests.',
  'Landlords and property managers only see information about the properties they manage. Tenants only see their own home, payments and messages.',
  'We never sell your personal information. We share it only with people who need it to manage your tenancy, or when the law requires it.',
  'You can ask us to correct or delete your information at any time from Account settings.',
];
const TERMS = [
  'By using My Nyumba you agree to provide accurate information and to keep your sign-in details private.',
  'My Nyumba helps landlords, tenants and managers keep rent, messages and maintenance organised. It does not replace your tenancy agreement.',
  'Payments recorded in the app are only as accurate as the information entered. Keep your receipts and references.',
  'We may suspend accounts that are used to harass others or to commit fraud.',
];

function TextSection({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Card>
      <View style={{ gap: spacing.md }}>
        {paragraphs.map((p) => <AppText key={p}>{p}</AppText>)}
        <AppText variant="caption" color={colors.textMuted}>Prototype summary. Replace with legally reviewed text before launch.</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, minHeight: 56 },
});

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { TextField } from '@/components/forms/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';
import type { UserRole } from '@/types';

const ROLES: { value: UserRole; title: string; body: string; icon: IconName }[] = [
  { value: 'landlord', title: 'Landlord', body: 'I own rental properties and collect rent', icon: 'business-outline' },
  { value: 'tenant', title: 'Tenant', body: 'I rent a home and want to pay and report issues', icon: 'home-outline' },
  { value: 'property_manager', title: 'Property Manager', body: 'I manage properties for landlords', icon: 'briefcase-outline' },
];

export default function CreateAccountScreen() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('landlord');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const next = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Enter your full name';
    if (!identifier.trim()) e.identifier = 'Enter your email or phone number';
    if (password.length < 8) e.password = 'Use at least 8 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    // TODO(supabase): supabase.auth.signUp({ ... }) then send verification code
    router.push({ pathname: '/verify', params: { role, identifier: identifier.trim() } });
  };

  return (
    <ScreenContainer header={<AppHeader title="Create account" showBack />}>
      <AppText variant="heading" style={{ marginBottom: spacing.md }}>What are you using My Nyumba as?</AppText>
      <View style={styles.roles} accessibilityRole="radiogroup">
        {ROLES.map((r) => {
          const selected = r.value === role;
          return (
            <Pressable key={r.value} onPress={() => setRole(r.value)} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={`${r.title}. ${r.body}`} style={[styles.role, selected && styles.roleSelected]}>
              <View style={styles.roleIcon}><Icon name={r.icon} size={22} color={colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{r.title}</AppText>
                <AppText variant="caption" color={colors.textMuted}>{r.body}</AppText>
              </View>
              <Icon name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.textMuted} />
            </Pressable>
          );
        })}
      </View>
      <TextField label="Full name" value={name} onChangeText={setName} error={errors.name} autoCapitalize="words" leftIcon="person-outline" />
      <TextField label="Email or phone" value={identifier} onChangeText={setIdentifier} error={errors.identifier} autoCapitalize="none" leftIcon="mail-outline" />
      <TextField label="Password" isPassword value={password} onChangeText={setPassword} error={errors.password} helper="At least 8 characters" leftIcon="lock-closed-outline" />
      <Button label="Continue" onPress={next} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  roles: { gap: spacing.sm, marginBottom: spacing.xl },
  role: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, minHeight: 72 },
  roleSelected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primarySoft },
  roleIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { TextField } from '@/components/forms/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useSession } from '@/hooks/useSession';
import { homeRouteFor } from '@/lib/utils/routing';
import type { UserRole } from '@/types';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signInAsDemo } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = () => {
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = 'Enter your email or phone number';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    // TODO(supabase): supabase.auth.signInWithPassword / signInWithOtp
    setTimeout(() => {
      const result = signIn(identifier, password);
      setLoading(false);
      if (!result.ok) setErrors({ form: result.error });
      else router.replace(homeRouteFor(result.user.role));
    }, 600);
  };

  const demo = (role: UserRole) => router.replace(homeRouteFor(signInAsDemo(role).role));

  return (
    <ScreenContainer header={<AppHeader title="Welcome back" showBack />}>
      <View style={styles.logo}><Logo size={40} /></View>
      <TextField label="Email or phone" leftIcon="mail-outline" value={identifier} onChangeText={setIdentifier} autoCapitalize="none" keyboardType="email-address" error={errors.identifier} placeholder="you@example.com or 0712 345 678" />
      <TextField label="Password" leftIcon="lock-closed-outline" isPassword value={password} onChangeText={setPassword} error={errors.password} placeholder="Your password" />
      {errors.form ? <AppText color={colors.danger} accessibilityRole="alert" style={{ marginBottom: spacing.md }}>{errors.form}</AppText> : null}
      <Button label="Sign In" onPress={submit} loading={loading} />
      <View style={styles.links}>
        <Pressable onPress={() => router.push('/forgot-password')} style={styles.link} accessibilityRole="link"><AppText color={colors.primary} variant="bodyStrong">Forgot password?</AppText></Pressable>
        <Pressable onPress={() => router.push('/create-account')} style={styles.link} accessibilityRole="link"><AppText color={colors.primary} variant="bodyStrong">Create account</AppText></Pressable>
      </View>

      <Card style={{ marginTop: spacing.xl }}>
        <AppText variant="heading">Prototype demo accounts</AppText>
        <AppText variant="caption" color={colors.textMuted} style={{ marginBottom: spacing.md }}>Skip the form and explore each role. Real sign-in arrives with Supabase.</AppText>
        <View style={{ gap: spacing.sm }}>
          <Button label="Continue as Landlord" variant="secondary" size="sm" onPress={() => demo('landlord')} />
          <Button label="Continue as Tenant" variant="secondary" size="sm" onPress={() => demo('tenant')} />
          <Button label="Continue as Admin" variant="secondary" size="sm" onPress={() => demo('admin')} />
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logo: { marginBottom: spacing.xl },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  link: { minHeight: 44, justifyContent: 'center' },
});

import { useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { CodeInput } from '@/components/forms/CodeInput';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useSession } from '@/hooks/useSession';
import { homeRouteFor } from '@/lib/utils/routing';
import type { UserRole } from '@/types';

export default function VerifyScreen() {
  const router = useRouter();
  const { signInAsDemo } = useSession();
  const { role, identifier } = useLocalSearchParams<{ role?: string; identifier?: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = () => {
    setLoading(true);
    // TODO(supabase): supabase.auth.verifyOtp({ token: code, ... })
    setTimeout(() => {
      setLoading(false);
      const user = signInAsDemo((role as UserRole) ?? 'landlord');
      router.replace(homeRouteFor(user.role));
    }, 600);
  };

  return (
    <ScreenContainer header={<AppHeader title="Verify your account" showBack />}>
      <AppText color={colors.textMuted} style={{ marginBottom: spacing.xl }}>
        We sent a 6-digit code to {identifier ?? 'you'}. Enter it below to finish creating your account.
      </AppText>
      <CodeInput value={code} onChange={setCode} />
      <AppText variant="caption" color={colors.textMuted} style={{ marginVertical: spacing.lg }}>Prototype: any 6 digits will work.</AppText>
      <Button label="Verify" onPress={verify} disabled={code.length < 6} loading={loading} />
      <Button label="Resend code" variant="ghost" onPress={() => Alert.alert('Code resent', 'A new code has been sent (mock).')} />
    </ScreenContainer>
  );
}

import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { TextField } from '@/components/forms/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string>();

  const send = () => {
    if (!identifier.trim()) return setError('Enter your email or phone number');
    setError(undefined);
    // TODO(supabase): supabase.auth.resetPasswordForEmail(...)
    router.push({ pathname: '/reset-password', params: { identifier: identifier.trim() } });
  };

  return (
    <ScreenContainer header={<AppHeader title="Forgot password" showBack />}>
      <AppText color={colors.textMuted} style={{ marginBottom: spacing.xl }}>Enter the email or phone number you signed up with and we will send you a reset code.</AppText>
      <TextField label="Email or phone" value={identifier} onChangeText={setIdentifier} error={error} autoCapitalize="none" leftIcon="mail-outline" />
      <Button label="Send reset code" onPress={send} />
    </ScreenContainer>
  );
}

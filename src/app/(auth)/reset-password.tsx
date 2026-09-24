import { useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { CodeInput } from '@/components/forms/CodeInput';
import { TextField } from '@/components/forms/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { identifier } = useLocalSearchParams<{ identifier?: string }>();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (code.length < 6) e.code = 'Enter the 6-digit code';
    if (password.length < 8) e.password = 'Use at least 8 characters';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    // TODO(supabase): supabase.auth.verifyOtp + supabase.auth.updateUser({ password })
    Alert.alert('Password updated', 'You can now sign in with your new password.', [{ text: 'Sign In', onPress: () => router.replace('/sign-in') }]);
  };

  return (
    <ScreenContainer header={<AppHeader title="Reset password" showBack />}>
      <AppText color={colors.textMuted} style={{ marginBottom: spacing.xl }}>Enter the code we sent to {identifier ?? 'you'} and choose a new password.</AppText>
      <CodeInput value={code} onChange={setCode} />
      {errors.code ? <AppText variant="caption" color={colors.danger} style={{ marginTop: spacing.sm }}>{errors.code}</AppText> : null}
      <AppText variant="caption" color={colors.textMuted} style={{ marginVertical: spacing.lg }}>Prototype: any 6 digits will work.</AppText>
      <TextField label="New password" isPassword value={password} onChangeText={setPassword} error={errors.password} leftIcon="lock-closed-outline" />
      <TextField label="Confirm new password" isPassword value={confirm} onChangeText={setConfirm} error={errors.confirm} leftIcon="lock-closed-outline" />
      <Button label="Update password" onPress={submit} />
    </ScreenContainer>
  );
}

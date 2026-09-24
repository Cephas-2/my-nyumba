import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { TextField } from '@/components/forms/TextField';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon, type IconName } from '@/components/ui/Icon';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatMoney } from '@/lib/utils/format';
import { getPaymentsSummary } from '@/services/tenant';

type Method = 'mpesa' | 'bank';
const METHODS: { value: Method; title: string; body: string; icon: IconName }[] = [
  { value: 'mpesa', title: 'M-Pesa', body: 'Pay from your phone', icon: 'phone-portrait-outline' },
  { value: 'bank', title: 'Bank transfer', body: 'Pay from your bank', icon: 'business-outline' },
];

// UI only. TODO(payments): M-Pesa STK push / Daraja and bank confirmations arrive in a later phase.
export default function PayScreen() {
  const router = useRouter();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data } = useMockQuery(`tenant-pay-${tenantId}`, () => getPaymentsSummary(tenantId));
  const [method, setMethod] = useState<Method>('mpesa');
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string>();

  if (!data) return <ScreenContainer header={<AppHeader title="Make a payment" showBack />}><LoadingState /></ScreenContainer>;

  const shownAmount = amount ?? String(data.nextAmount);
  const shownPhone = phone ?? data.tenancy.tenant.phone;

  const pay = () => {
    const value = Number(shownAmount.replace(/,/g, ''));
    if (!Number.isFinite(value) || value <= 0) return setError('Enter an amount greater than zero');
    setError(undefined);
    Alert.alert('Payments are not connected yet', 'This screen shows how paying will look. No money has moved.', [{ text: 'OK', onPress: () => router.back() }]);
  };

  return (
    <ScreenContainer header={<AppHeader title="Make a payment" showBack />} footer={<Button label={`Pay ${formatMoney(Number(shownAmount.replace(/,/g, '')) || 0)}`} onPress={pay} />}>
      <Card style={{ backgroundColor: colors.infoSoft, borderColor: colors.infoSoft, marginBottom: spacing.lg }}>
        <View style={styles.note}>
          <Icon name="information-circle-outline" size={20} color={colors.info} />
          <AppText color={colors.info} style={{ flex: 1 }}>Online payments are coming in a later phase. This is a preview of the flow.</AppText>
        </View>
      </Card>

      <TextField label="Amount (KSh)" value={shownAmount} onChangeText={setAmount} keyboardType="number-pad" error={error} helper={`Rent due: ${formatMoney(data.nextAmount)}`} />

      <AppText variant="label" style={{ marginBottom: spacing.sm }}>Payment method</AppText>
      <View style={styles.methods} accessibilityRole="radiogroup">
        {METHODS.map((m) => {
          const selected = m.value === method;
          return (
            <Pressable key={m.value} onPress={() => setMethod(m.value)} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={`${m.title}. ${m.body}`} style={[styles.method, selected && styles.methodSelected]}>
              <Icon name={m.icon} size={24} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <AppText variant="bodyStrong">{m.title}</AppText>
                <AppText variant="caption" color={colors.textMuted}>{m.body}</AppText>
              </View>
              <Icon name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.textMuted} />
            </Pressable>
          );
        })}
      </View>

      {method === 'mpesa' ? (
        <TextField label="M-Pesa phone number" value={shownPhone} onChangeText={setPhone} keyboardType="phone-pad" leftIcon="call-outline" helper="The number that will approve the payment" />
      ) : (
        <Card>
          <AppText variant="heading" style={{ marginBottom: spacing.sm }}>Bank details</AppText>
          <InfoRow label="Account name" value={data.tenancy.landlord.businessName ?? data.tenancy.landlord.fullName} />
          <InfoRow label="Bank and account number" value="Provided by your landlord" />
          <InfoRow label="Reference" value={`Unit ${data.tenancy.unit.unitNumber}`} />
        </Card>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  note: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  methods: { gap: spacing.sm, marginBottom: spacing.lg },
  method: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, minHeight: 68, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  methodSelected: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primarySoft },
});

import { Alert, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { spacing } from '@/constants/theme';
import { ReceiptView } from '@/components/cards/ReceiptView';
import { AppHeader } from '@/components/navigation/AppHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { getTenantPayment } from '@/services/tenant';

export default function TenantReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, loading } = useMockQuery(`tenant-receipt-${id}`, () => getTenantPayment(String(id), tenantId));
  const header = <AppHeader title="Receipt" showBack />;

  if (loading && !data) return <ScreenContainer header={header}><LoadingState /></ScreenContainer>;
  if (!data) return <ScreenContainer header={header}><EmptyState icon="receipt-outline" title="Receipt not found" message="This payment does not exist or is not yours." /></ScreenContainer>;
  if (data.payment.status === 'pending' || data.payment.status === 'overdue') {
    return <ScreenContainer header={header}><EmptyState icon="hourglass-outline" title="No receipt yet" message="A receipt is created once a payment is received." /></ScreenContainer>;
  }

  const { payment, tenancy } = data;
  return (
    <ScreenContainer header={header}>
      <ReceiptView payment={payment} tenantName={tenancy.tenant.fullName} unitNumber={tenancy.unit.unitNumber} propertyName={tenancy.property.name} landlordName={tenancy.landlord.fullName} />
      <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
        <Button label="Share receipt" icon="share-outline" onPress={() => Alert.alert('Coming later', 'Sharing will export the receipt as a PDF.')} />
        <Button label="Download PDF" variant="secondary" icon="download-outline" onPress={() => Alert.alert('Coming later', 'PDF export arrives with Supabase Storage.')} />
      </View>
    </ScreenContainer>
  );
}

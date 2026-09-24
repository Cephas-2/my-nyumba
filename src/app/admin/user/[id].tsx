import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { InfoRow } from '@/components/ui/InfoRow';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MetaBadge, StatusBadge } from '@/components/ui/StatusBadge';
import { useMockQuery } from '@/hooks/useMockQuery';
import { formatDate } from '@/lib/utils/format';
import { accountStatusMeta, roleMeta } from '@/lib/utils/meta';
import { getUserDetail, setUserStatus } from '@/services/admin';

export default function AdminUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = String(id);
  const { data, loading, error, refetch } = useMockQuery(`admin-user-${userId}`, () => getUserDetail(userId));
  const [confirm, setConfirm] = useState(false);
  const header = <AppHeader title="User details" showBack />;

  if (error) return <ScreenContainer header={header}><ErrorState message={error} onRetry={refetch} /></ScreenContainer>;
  if (loading && !data) return <ScreenContainer header={header}><LoadingState /></ScreenContainer>;
  if (!data) return <ScreenContainer header={header}><EmptyState icon="person-outline" title="User not found" /></ScreenContainer>;

  const { user } = data;
  const suspended = user.status === 'suspended';
  const role = roleMeta[user.role];

  return (
    <ScreenContainer header={header}>
      <View style={styles.center}>
        <Avatar name={user.fullName} size={80} />
        <AppText variant="title">{user.fullName}</AppText>
        <View style={styles.badges}>
          <StatusBadge label={role.label} tone={role.tone} icon={role.icon} />
          <MetaBadge meta={accountStatusMeta[user.status]} />
        </View>
      </View>

      <SectionHeader title="Contact" />
      <Card>
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Joined" value={formatDate(user.createdAt)} />
      </Card>

      {user.role === 'landlord' ? (
        <>
          <SectionHeader title="Portfolio" />
          <Card>
            <InfoRow label="Properties" value={String(data.ownedProperties.length)} />
            <InfoRow label="Units" value={String(data.ownedUnits)} />
            {data.ownedProperties.map((p) => <InfoRow key={p.id} label={p.name} value={p.location.city} />)}
          </Card>
        </>
      ) : null}

      {user.role === 'tenant' ? (
        <>
          <SectionHeader title="Tenancy" />
          <Card>
            {data.tenancy ? (
              <>
                <InfoRow label="Property" value={data.tenancy.property.name} />
                <InfoRow label="Unit" value={data.tenancy.unit.unitNumber} />
                <InfoRow label="Maintenance requests" value={String(data.requestCount)} />
              </>
            ) : <AppText color={colors.textMuted}>Not assigned to a unit.</AppText>}
          </Card>
        </>
      ) : null}

      <SectionHeader title="Account actions" />
      {user.role === 'admin' ? (
        <AppText color={colors.textMuted}>Administrator accounts cannot be suspended from here.</AppText>
      ) : (
        <>
          <AppText color={colors.textMuted} style={{ marginBottom: spacing.md }}>
            {suspended ? 'This account cannot sign in. Activate it to restore access.' : 'Suspending blocks sign-in immediately. Their data is kept.'}
          </AppText>
          <Button label={suspended ? 'Activate account' : 'Suspend account'} variant={suspended ? 'primary' : 'danger'} icon={suspended ? 'checkmark-circle-outline' : 'ban-outline'} onPress={() => setConfirm(true)} />
        </>
      )}

      <ConfirmationModal
        visible={confirm} destructive={!suspended}
        title={suspended ? 'Activate this account?' : 'Suspend this account?'}
        message={suspended ? `${user.fullName} will be able to sign in again.` : `${user.fullName} will be signed out and blocked until you activate the account.`}
        confirmLabel={suspended ? 'Activate' : 'Suspend'}
        onCancel={() => setConfirm(false)}
        onConfirm={() => { setUserStatus(user.id, suspended ? 'active' : 'suspended'); /* TODO(supabase): RPC + audit log */ setConfirm(false); refetch(); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md },
  badges: { flexDirection: 'row', gap: spacing.sm },
});

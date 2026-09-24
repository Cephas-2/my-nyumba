import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { spacing } from '@/constants/theme';
import { TextField } from '@/components/forms/TextField';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { useSession } from '@/hooks/useSession';
import { formatDate } from '@/lib/utils/format';
import { getTenancy } from '@/services/tenant';

export default function TenantProfileScreen() {
  const { user } = useSession();
  const tenancy = getTenancy(user?.id ?? '');
  const tenant = tenancy?.tenant;
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(tenant?.phone ?? '');
  const [ecName, setEcName] = useState(tenant?.emergencyContact?.name ?? '');
  const [ecRelation, setEcRelation] = useState(tenant?.emergencyContact?.relationship ?? '');
  const [ecPhone, setEcPhone] = useState(tenant?.emergencyContact?.phone ?? '');

  if (!tenant) return <ScreenContainer header={<AppHeader title="Profile" showBack />}><EmptyState icon="person-outline" title="Profile unavailable" /></ScreenContainer>;

  const save = () => {
    // TODO(supabase): update `profiles` and `emergency_contacts` for auth.uid()
    setEditing(false);
    Alert.alert('Saved (prototype)', 'Changes are not stored yet. Supabase will persist them in the next phase.');
  };

  return (
    <ScreenContainer
      header={<AppHeader title="Profile" showBack right={<IconButton icon={editing ? 'close' : 'create-outline'} label={editing ? 'Cancel editing' : 'Edit profile'} onPress={() => setEditing((e) => !e)} />} />}
      footer={editing ? <Button label="Save changes" onPress={save} /> : undefined}
    >
      <View style={styles.center}>
        <Avatar name={tenant.fullName} size={80} />
        <AppText variant="title">{tenant.fullName}</AppText>
        <AppText color="#55635D">Unit {tenancy.unit.unitNumber} · {tenancy.property.name}</AppText>
      </View>

      <SectionHeader title="Personal information" />
      <Card>
        <InfoRow label="Full name" value={tenant.fullName} />
        <InfoRow label="Member since" value={formatDate(tenant.createdAt)} />
        <InfoRow label="Lease start" value={formatDate(tenancy.lease.startDate)} />
      </Card>

      <SectionHeader title="Contact information" />
      <Card>
        <InfoRow label="Email" value={tenant.email} />
        {editing ? <TextField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /> : <InfoRow label="Phone" value={phone} />}
      </Card>

      <SectionHeader title="Emergency contact" />
      <Card>
        {editing ? (
          <>
            <TextField label="Name" value={ecName} onChangeText={setEcName} />
            <TextField label="Relationship" value={ecRelation} onChangeText={setEcRelation} />
            <TextField label="Phone" value={ecPhone} onChangeText={setEcPhone} keyboardType="phone-pad" />
          </>
        ) : (
          <>
            <InfoRow label="Name" value={ecName || 'Not added'} />
            <InfoRow label="Relationship" value={ecRelation || '-'} />
            <InfoRow label="Phone" value={ecPhone || '-'} />
          </>
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.md } });

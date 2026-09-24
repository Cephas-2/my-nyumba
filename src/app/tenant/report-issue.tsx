import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { ChoiceGroup } from '@/components/forms/ChoiceGroup';
import { TextField } from '@/components/forms/TextField';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import type { MaintenanceCategory, MaintenancePriority } from '@/types';

const CATEGORIES: { label: string; value: MaintenanceCategory }[] = [
  { label: 'Plumbing', value: 'plumbing' }, { label: 'Electricity', value: 'electricity' }, { label: 'Water', value: 'water' },
  { label: 'Internet', value: 'internet' }, { label: 'Security', value: 'security' }, { label: 'Appliance', value: 'appliance' }, { label: 'Other', value: 'other' },
];
const PRIORITIES: { label: string; value: MaintenancePriority }[] = [
  { label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }, { label: 'Urgent', value: 'urgent' },
];

export default function ReportIssueScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('plumbing');
  const [priority, setPriority] = useState<MaintenancePriority>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Give the issue a short title';
    if (description.trim().length < 10) e.description = 'Describe the problem in a few words';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    // TODO(supabase): insert into `maintenance_requests`; upload media to Storage; notify landlord.
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Request sent', 'Your landlord has been notified. This is a prototype, so nothing is saved yet.', [{ text: 'OK', onPress: () => router.replace('/tenant/maintenance') }]);
    }, 600);
  };

  return (
    <ScreenContainer header={<AppHeader title="Report an issue" showBack />} footer={<Button label="Submit request" onPress={submit} loading={saving} />}>
      <TextField label="Issue title" value={title} onChangeText={setTitle} error={errors.title} placeholder="e.g. Kitchen tap is leaking" />
      <TextField label="Description" value={description} onChangeText={setDescription} error={errors.description} multiline placeholder="What is happening, and since when?" />
      <ChoiceGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
      <ChoiceGroup label="Priority" options={PRIORITIES} value={priority} onChange={setPriority} />
      <AppText variant="label" style={{ marginBottom: spacing.xs }}>Photos or videos</AppText>
      <Pressable accessibilityRole="button" accessibilityLabel="Add photos or videos" onPress={() => Alert.alert('Coming later', 'Media upload will use expo-image-picker and Supabase Storage.')} style={styles.media}>
        <Icon name="camera-outline" size={28} color={colors.primary} />
        <AppText color={colors.primary} variant="bodyStrong">Add photos or videos</AppText>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  media: { minHeight: 110, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});

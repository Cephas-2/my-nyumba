import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { ChoiceGroup } from '@/components/forms/ChoiceGroup';
import { TextField } from '@/components/forms/TextField';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppHeader } from '@/components/navigation/AppHeader';
import { getPropertyForEdit } from '@/services/landlord';
import type { PropertyType } from '@/types';

const TYPES: { label: string; value: PropertyType }[] = [
  { label: 'Apartment', value: 'apartment' }, { label: 'Maisonette', value: 'maisonette' },
  { label: 'Townhouse', value: 'townhouse' }, { label: 'Bungalow', value: 'bungalow' },
  { label: 'Commercial', value: 'commercial' }, { label: 'Hostel', value: 'hostel' },
];

export default function PropertyFormScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const existing = editId ? getPropertyForEdit(String(editId)) : undefined;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.property.name ?? '');
  const [type, setType] = useState<PropertyType>(existing?.property.type ?? 'apartment');
  const [area, setArea] = useState(existing?.property.location.area ?? '');
  const [city, setCity] = useState(existing?.property.location.city ?? '');
  const [description, setDescription] = useState(existing?.property.description ?? '');
  const [unitCount, setUnitCount] = useState(existing ? String(existing.unitCount) : '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Give the property a name';
    if (!area.trim()) e.area = 'Enter the area or estate';
    if (!city.trim()) e.city = 'Enter the town or city';
    if (!/^[1-9]\d*$/.test(unitCount.trim())) e.unitCount = 'Enter a whole number of units, 1 or more';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    // TODO(supabase): insert/update into `properties` (and create `units` rows); upload image to Storage.
    setTimeout(() => {
      setSaving(false);
      Alert.alert(isEdit ? 'Property updated' : 'Property added', 'This is a prototype, so nothing is saved yet. Supabase will store it in the next phase.', [
        { text: 'OK', onPress: () => router.replace('/landlord/properties') },
      ]);
    }, 600);
  };

  return (
    <ScreenContainer
      header={<AppHeader title={isEdit ? 'Edit property' : 'Add property'} showBack />}
      footer={<Button label={isEdit ? 'Save changes' : 'Add property'} onPress={save} loading={saving} />}
    >
      <TextField label="Property name" value={name} onChangeText={setName} error={errors.name} placeholder="e.g. Kilimani Heights" />
      <ChoiceGroup label="Property type" options={TYPES} value={type} onChange={setType} />
      <TextField label="Area or estate" value={area} onChangeText={setArea} error={errors.area} placeholder="e.g. Kilimani" leftIcon="location-outline" />
      <TextField label="Town or city" value={city} onChangeText={setCity} error={errors.city} placeholder="e.g. Nairobi" />
      <TextField label="Number of units" value={unitCount} onChangeText={setUnitCount} error={errors.unitCount} keyboardType="number-pad" placeholder="e.g. 8" />
      <TextField label="Description" value={description} onChangeText={setDescription} multiline placeholder="Amenities, security, water supply..." />
      <AppText variant="label" style={{ marginBottom: spacing.xs }}>Property photo</AppText>
      <Pressable
        accessibilityRole="button" accessibilityLabel="Add a property photo"
        onPress={() => Alert.alert('Coming later', 'Photo upload will use expo-image-picker and Supabase Storage.')} // TODO(supabase-storage)
        style={styles.photo}
      >
        <Icon name="image-outline" size={28} color={colors.primary} />
        <AppText color={colors.primary} variant="bodyStrong">Add a photo</AppText>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  photo: { minHeight: 110, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});

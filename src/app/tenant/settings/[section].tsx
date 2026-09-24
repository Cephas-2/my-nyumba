import { useLocalSearchParams } from 'expo-router';
import { SettingsSectionScreen } from '@/components/ui/SettingsSections';

export default function TenantSettingsRoute() {
  const { section } = useLocalSearchParams<{ section: string }>();
  return <SettingsSectionScreen section={String(section)} />;
}

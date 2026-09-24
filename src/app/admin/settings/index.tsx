import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { APP_CONFIG } from '@/constants/config';
import { colors, spacing } from '@/constants/theme';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';

function Row({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{label}</AppText>
        <AppText variant="caption" color={colors.textMuted}>{description}</AppText>
      </View>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} trackColor={{ true: colors.primary, false: colors.border }} />
    </View>
  );
}

// Placeholder settings. TODO(supabase): store in a `platform_settings` table editable only by admins.
export default function AdminSettingsScreen() {
  const [registrations, setRegistrations] = useState(true);
  const [verifyLandlords, setVerifyLandlords] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  return (
    <ScreenContainer header={<AppHeader title="Platform settings" showBack />}>
      <SectionHeader title="Access" />
      <Card>
        <Row label="Allow new sign-ups" description="Turn off to pause registration" value={registrations} onChange={setRegistrations} />
        <Row label="Verify new landlords" description="Review landlords before they can add properties" value={verifyLandlords} onChange={setVerifyLandlords} />
        <Row label="Maintenance mode" description="Show a notice and pause the app for users" value={maintenanceMode} onChange={setMaintenanceMode} />
      </Card>
      <SectionHeader title="Defaults" />
      <Card>
        <InfoRow label="Currency" value={`${APP_CONFIG.currency.code} (${APP_CONFIG.currency.symbol})`} />
        <InfoRow label="Default country" value="Kenya" />
        <InfoRow label="Support email" value={APP_CONFIG.supportEmail} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, minHeight: 60 } });

import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { layout, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { colors } from '@/constants/theme';

interface Props { title: string; subtitle?: string; showBack?: boolean; onBack?: () => void; right?: ReactNode }

export function AppHeader({ title, subtitle, showBack, onBack, right }: Props) {
  const router = useRouter();
  const goBack = () => (onBack ? onBack() : router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={styles.row}>
      {showBack ? <IconButton icon="arrow-back" label="Go back" onPress={goBack} /> : null}
      <View style={styles.titles}>
        <AppText variant="title" numberOfLines={1} accessibilityRole="header">{title}</AppText>
        {subtitle ? <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>{subtitle}</AppText> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: layout.screenPadding, paddingVertical: spacing.md, minHeight: 60 },
  titles: { flex: 1 },
});

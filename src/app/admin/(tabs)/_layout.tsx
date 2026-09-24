import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';
import { Icon, type IconName } from '@/components/ui/Icon';

const TAB = (title: string, on: IconName, off: IconName) => ({
  title,
  tabBarIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Icon name={focused ? on : off} size={24} color={color} />
  ),
});

export default function AdminTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen name="overview" options={TAB('Overview', 'grid', 'grid-outline')} />
      <Tabs.Screen name="users" options={TAB('Users', 'people', 'people-outline')} />
      <Tabs.Screen name="properties" options={TAB('Properties', 'business', 'business-outline')} />
      <Tabs.Screen name="maintenance" options={TAB('Maintenance', 'construct', 'construct-outline')} />
      <Tabs.Screen name="more" options={TAB('More', 'menu', 'menu-outline')} />
    </Tabs>
  );
}

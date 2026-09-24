import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/theme';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useSession } from '@/hooks/useSession';
import { getUnreadCount } from '@/services/messaging';

const TAB = (title: string, on: IconName, off: IconName) => ({
  title,
  tabBarIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Icon name={focused ? on : off} size={24} color={color} />
  ),
});

export default function TenantTabs() {
  const { user } = useSession();
  const unread = getUnreadCount(user?.id ?? '');
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
      <Tabs.Screen name="home" options={TAB('Home', 'home', 'home-outline')} />
      <Tabs.Screen name="payments" options={TAB('Payments', 'wallet', 'wallet-outline')} />
      <Tabs.Screen name="maintenance" options={TAB('Maintenance', 'construct', 'construct-outline')} />
      <Tabs.Screen name="messages" options={{ ...TAB('Messages', 'chatbubbles', 'chatbubbles-outline'), tabBarBadge: unread || undefined }} />
      <Tabs.Screen name="more" options={TAB('More', 'menu', 'menu-outline')} />
    </Tabs>
  );
}

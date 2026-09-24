import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';

export default function TenantLayout() {
  const { user } = useSession();
  // Route guard. TODO(supabase): RLS is the real protection; this only improves the UX.
  if (!user || user.role !== 'tenant') return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

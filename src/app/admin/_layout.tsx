import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';

export default function AdminLayout() {
  const { user } = useSession();
  // TODO(supabase): admin status must come from a server-side claim / table, never from client input.
  if (!user || user.role !== 'admin') return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

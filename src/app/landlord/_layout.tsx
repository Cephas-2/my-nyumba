import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';

export default function LandlordLayout() {
  const { user } = useSession();
  // Route guard. TODO(supabase): also enforce with Row Level Security; UI guards are convenience only.
  if (!user || user.role !== 'landlord') return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}

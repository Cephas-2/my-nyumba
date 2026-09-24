import { useLocalSearchParams } from 'expo-router';
import { ComingSoon } from '@/components/ui/ComingSoon';

export default function ComingSoonRoute() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  return <ComingSoon title={title ? String(title) : 'This section'} />;
}

import { useLocalSearchParams } from 'expo-router';
import { ConversationScreen } from '@/components/ui/ConversationScreen';

export default function TenantChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ConversationScreen conversationId={String(id)} />;
}

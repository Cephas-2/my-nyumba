import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '@/constants/theme';
import { ConversationCard } from '@/components/cards/ConversationCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { listConversations } from '@/services/messaging';

export default function TenantMessagesScreen() {
  const router = useRouter();
  const { user } = useSession();
  const userId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`tenant-conversations-${userId}`, () => listConversations(userId));

  return (
    <ScreenContainer hasTabBar header={<AppHeader title="Messages" subtitle="Your landlord and property manager" />} refreshing={loading && !!data} onRefresh={refetch}>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : data.length === 0 ? (
        <EmptyState icon="chatbubbles-outline" title="No conversations yet" message="Messages with your landlord or property manager will show up here." />
      ) : (
        <View style={{ gap: spacing.md }}>
          {data.map((row) => <ConversationCard key={row.conversation.id} row={row} onPress={() => router.push(`/tenant/chat/${row.conversation.id}`)} />)}
        </View>
      )}
    </ScreenContainer>
  );
}

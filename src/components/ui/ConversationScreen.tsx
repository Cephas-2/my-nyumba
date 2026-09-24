import { useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, radius, spacing } from '@/constants/theme';
import { MessageBubble } from '@/components/cards/MessageBubble';
import { AppHeader } from '@/components/navigation/AppHeader';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { roleMeta } from '@/lib/utils/meta';
import { getThread } from '@/services/messaging';
import type { Message } from '@/types';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { IconButton } from './IconButton';
import { LoadingState } from './LoadingState';

// Shared chat screen for landlord <-> tenant <-> property manager conversations.
export function ConversationScreen({ conversationId }: { conversationId: string }) {
  const { user } = useSession();
  const userId = user?.id ?? '';
  const { data, loading, error, refetch } = useMockQuery(`thread-${conversationId}`, () => getThread(conversationId, userId));
  const [sent, setSent] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const send = () => {
    const body = text.trim();
    if (!body) return;
    // TODO(supabase-realtime): insert into `messages`; other participants receive it via a Realtime channel.
    setSent((s) => [...s, { id: `local-${Date.now()}`, conversationId, senderId: userId, body, sentAt: new Date().toISOString(), read: true }]);
    setText('');
  };

  const header = (
    <AppHeader title={data?.other.fullName ?? 'Conversation'} subtitle={data ? roleMeta[data.other.role].label : undefined} showBack />
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {header}
      {error ? <ErrorState message={error} onRetry={refetch} /> : loading && !data ? <LoadingState label="Loading messages..." /> : !data ? (
        <EmptyState icon="chatbubbles-outline" title="Conversation not found" message="You may not have access to this conversation." />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'web' ? undefined : 'padding'}>
          <FlatList
            ref={listRef}
            data={[...data.messages, ...sent]}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.list}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item }) => <MessageBubble message={item} own={item.senderId === userId} />}
          />
          <View style={styles.composer}>
            <IconButton icon="attach" label="Attach a file" onPress={() => Alert.alert('Coming later', 'Attachments will use Supabase Storage.')} />
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a message"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="Message"
              multiline
              style={styles.input}
            />
            <IconButton icon="send" label="Send message" filled onPress={send} />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: layout.screenPadding, paddingVertical: spacing.lg },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, padding: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, maxHeight: 110, minHeight: 44, fontSize: 16, color: colors.text, backgroundColor: colors.background, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingTop: 10, paddingBottom: 10 },
});

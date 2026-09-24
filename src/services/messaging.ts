import type { Conversation, Message, User } from '@/types';
import { conversations, messages, users } from '@/data/mock';

// TODO(supabase): conversations/messages tables + Realtime subscription. RLS: only participants can read.
export interface ConversationRow { conversation: Conversation; other: User }

export function listConversations(userId: string): ConversationRow[] {
  const rows: ConversationRow[] = [];
  conversations.forEach((conversation) => {
    if (!conversation.participantIds.includes(userId)) return;
    const otherId = conversation.participantIds.find((p) => p !== userId);
    const other = users.find((u) => u.id === otherId);
    if (other) rows.push({ conversation, other });
  });
  return rows.sort((a, b) => b.conversation.lastMessageAt.localeCompare(a.conversation.lastMessageAt));
}

export function getThread(conversationId: string, userId: string) {
  const conversation = conversations.find((c) => c.id === conversationId);
  if (!conversation || !conversation.participantIds.includes(userId)) return undefined;
  const otherId = conversation.participantIds.find((p) => p !== userId);
  const other = users.find((u) => u.id === otherId);
  if (!other) return undefined;
  return {
    conversation,
    other,
    messages: messages.filter((m) => m.conversationId === conversationId).sort((a, b) => a.sentAt.localeCompare(b.sentAt)),
  };
}

export function getUnreadCount(userId: string): number {
  return conversations.filter((c) => c.participantIds.includes(userId)).reduce((t, c) => t + c.unreadCount, 0);
}

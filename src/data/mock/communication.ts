import type { ActivityEvent, Conversation, Message, Notification } from '@/types';
import { daysAgo, hoursAgo } from '@/lib/utils/date';
import { landlord, tenants } from './users';

export const activityEvents: ActivityEvent[] = [
  { id: 'a1', landlordId: landlord.id, propertyId: 'p1', type: 'payment', title: 'Tenant paid rent', description: `${tenants[0].fullName} paid rent for Kilimani Heights A1`, createdAt: hoursAgo(2) },
  { id: 'a2', landlordId: landlord.id, propertyId: 'p2', type: 'maintenance', title: 'Maintenance request created', description: `${tenants[6].fullName} reported: No running water since morning`, createdAt: hoursAgo(3) },
  { id: 'a3', landlordId: landlord.id, propertyId: 'p3', type: 'tenant', title: 'New tenant added', description: `${tenants[14].fullName} moved into Athi River Court C4`, createdAt: daysAgo(1) },
  { id: 'a4', landlordId: landlord.id, propertyId: 'p1', type: 'unit', title: 'Unit became vacant', description: 'Kilimani Heights A5 is now available to let', createdAt: daysAgo(2) },
  { id: 'a5', landlordId: landlord.id, propertyId: 'p4', type: 'payment', title: 'Partial payment received', description: `${tenants[19].fullName} paid part of this month's rent for Nyali Sea View D4`, createdAt: daysAgo(3) },
  { id: 'a6', landlordId: landlord.id, propertyId: 'p2', type: 'maintenance', title: 'Maintenance completed', description: 'Security light at Ruaka Gardens gate was repaired', createdAt: daysAgo(5) },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: landlord.id, type: 'payment', title: 'Rent received', body: `${tenants[0].fullName} paid rent for A1`, createdAt: hoursAgo(2), read: false },
  { id: 'n2', userId: landlord.id, type: 'maintenance', title: 'Urgent request', body: 'No running water reported at Ruaka Gardens B1', createdAt: hoursAgo(3), read: false },
  { id: 'n3', userId: tenants[0].id, type: 'notice', title: 'Water maintenance', body: 'Water will be off on Saturday from 9am to 1pm', createdAt: daysAgo(1), read: false },
  { id: 'n4', userId: tenants[0].id, type: 'payment', title: 'Payment received', body: 'Your rent payment was recorded. Thank you.', createdAt: hoursAgo(2), read: true },
];

export const conversations: Conversation[] = [
  { id: 'c1', participantIds: [landlord.id, tenants[0].id], propertyId: 'p1', lastMessage: 'Thanks, the electrician will come tomorrow morning.', lastMessageAt: hoursAgo(1), unreadCount: 1 },
  { id: 'c2', participantIds: [landlord.id, tenants[6].id], propertyId: 'p2', lastMessage: 'The water is still off. Any update?', lastMessageAt: hoursAgo(2), unreadCount: 2 },
  { id: 'c3', participantIds: [landlord.id, tenants[19].id], propertyId: 'p4', lastMessage: 'I will send the balance on Friday.', lastMessageAt: daysAgo(3), unreadCount: 0 },
];

export const messages: Message[] = [
  { id: 'msg1', conversationId: 'c1', senderId: tenants[0].id, body: 'Good morning. The sockets in my bedroom still have no power.', sentAt: daysAgo(1), read: true },
  { id: 'msg2', conversationId: 'c1', senderId: landlord.id, body: 'Good morning Brian. I have asked BrightSpark Electricals to check it.', sentAt: hoursAgo(20), read: true },
  { id: 'msg3', conversationId: 'c1', senderId: landlord.id, body: 'Thanks, the electrician will come tomorrow morning.', sentAt: hoursAgo(1), read: false },
  { id: 'msg4', conversationId: 'c2', senderId: tenants[6].id, body: 'Hello, we have had no water since 6am.', sentAt: hoursAgo(3), read: true },
  { id: 'msg5', conversationId: 'c2', senderId: tenants[6].id, body: 'The water is still off. Any update?', sentAt: hoursAgo(2), read: false, attachmentName: 'tank-photo.jpg' },
  { id: 'msg6', conversationId: 'c3', senderId: tenants[19].id, body: 'I will send the balance on Friday.', sentAt: daysAgo(3), read: true },
];

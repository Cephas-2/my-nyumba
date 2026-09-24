import type { Dispute, Notice, PropertyFlag, User } from '@/types';
import { daysAgo } from '@/lib/utils/date';
import { conversations, messages } from './communication';
import { documents } from './documents';
import { maintenanceRequests } from './maintenance';
import { properties } from './properties';
import { admin, landlord, tenants, users } from './users';

// A property manager who looks after Kilimani Heights on the landlord's behalf.
export const manager: User = {
  id: 'u-manager-1', role: 'property_manager', fullName: 'Kevin Maina', email: 'kevin.maina@example.com',
  phone: '0745 600 321', status: 'active', createdAt: daysAgo(300),
};
users.push(manager);
properties[0].managerId = manager.id;

conversations.push({
  id: 'c4', participantIds: [manager.id, tenants[0].id], propertyId: 'p1',
  lastMessage: 'Yes, the caretaker will inspect the tanks and water returns by 1pm.', lastMessageAt: daysAgo(1), unreadCount: 0,
});
messages.push(
  { id: 'msg7', conversationId: 'c4', senderId: manager.id, body: 'Hello Brian, this is Kevin, the property manager for Kilimani Heights. Reach out any time about the building.', sentAt: daysAgo(14), read: true },
  { id: 'msg8', conversationId: 'c4', senderId: tenants[0].id, body: 'Thanks Kevin. Will the water be back after the tank cleaning on Saturday?', sentAt: daysAgo(1), read: true },
  { id: 'msg9', conversationId: 'c4', senderId: manager.id, body: 'Yes, the caretaker will inspect the tanks and water returns by 1pm.', sentAt: daysAgo(1), read: true },
);

documents.push(
  { id: 'd7', ownerId: landlord.id, propertyId: 'p1', category: 'notice', name: 'House rules - Kilimani Heights.pdf', sizeKb: 180, uploadedAt: daysAgo(200) },
  { id: 'd8', ownerId: landlord.id, propertyId: 'p1', tenantId: tenants[0].id, category: 'maintenance', name: 'Electrical inspection report - A1.pdf', sizeKb: 260, uploadedAt: daysAgo(1) },
  { id: 'd9', ownerId: landlord.id, propertyId: 'p1', tenantId: tenants[0].id, category: 'receipt', name: 'Rent receipt - previous month.pdf', sizeKb: 94, uploadedAt: daysAgo(33) },
  { id: 'd10', ownerId: landlord.id, propertyId: 'p1', category: 'notice', name: 'Water tank cleaning notice.pdf', sizeKb: 110, uploadedAt: daysAgo(1) },
);

export const notices: Notice[] = [
  { id: 'nt1', landlordId: landlord.id, propertyId: 'p1', category: 'maintenance', title: 'Water tank cleaning on Saturday', body: 'Water will be off on Saturday from 9am to 1pm while we clean the storage tanks. Please store enough water in advance.', createdAt: daysAgo(1) },
  { id: 'nt2', landlordId: landlord.id, propertyId: 'p1', category: 'emergency', title: 'Emergency: temporary power outage', body: 'Kenya Power is carrying out emergency repairs. Power will be off from about 2pm to 6pm. The backup generator will run the lifts and common lights.', createdAt: daysAgo(3) },
  { id: 'nt3', landlordId: landlord.id, propertyId: 'p1', category: 'rent_reminder', title: 'Rent is due on the 5th', body: 'A friendly reminder that rent is due on the 5th of every month. Pay by M-Pesa or bank transfer and keep your reference for the receipt.', createdAt: daysAgo(6) },
  { id: 'nt4', landlordId: landlord.id, propertyId: 'p1', category: 'general', title: 'New visitor parking arrangements', body: 'Visitors should now park in the marked bays near the gate. Please do not block the resident bays in the basement.', createdAt: daysAgo(12) },
  { id: 'nt5', landlordId: landlord.id, propertyId: 'p2', category: 'general', title: 'Estate meeting this Sunday', body: 'All residents are invited to the Ruaka Gardens meeting at 4pm in the clubhouse to discuss security and waste collection.', createdAt: daysAgo(2) },
  { id: 'nt6', landlordId: landlord.id, propertyId: 'p4', category: 'rent_reminder', title: 'Rent due on the 28th', body: 'Rent for Nyali Sea View is due on the 28th. Late payments may attract a reminder from the property team.', createdAt: daysAgo(4) },
];

const requestTenant = (requestId: string) => maintenanceRequests.find((r) => r.id === requestId)?.tenantId ?? tenants[0].id;

export const disputes: Dispute[] = [
  { id: 'dp1', requestId: 'm2', raisedBy: requestTenant('m2'), reason: 'Tenant says the tap repair was reported twice and no one has visited yet.', status: 'open', createdAt: daysAgo(1) },
  { id: 'dp2', requestId: 'm8', raisedBy: requestTenant('m8'), reason: 'Tenant disputes the KSh 4,000 drain repair cost and asks who should pay.', status: 'open', createdAt: daysAgo(6) },
  { id: 'dp3', requestId: 'm7', raisedBy: requestTenant('m7'), reason: 'Gate light repair was marked complete but the light still flickered.', status: 'resolved', createdAt: daysAgo(8) },
];

export const propertyFlags: PropertyFlag[] = [
  { id: 'fl1', propertyId: 'p3', reason: 'Unresolved complaints', note: 'Several tenants have reported the same broken gate lock over three weeks.', reportedBy: admin.id, createdAt: daysAgo(4) },
];

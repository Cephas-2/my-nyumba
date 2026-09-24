import type { Document } from '@/types';
import { daysAgo } from '@/lib/utils/date';
import { landlord, tenants } from './users';

export const documents: Document[] = [
  { id: 'd1', ownerId: landlord.id, propertyId: 'p1', tenantId: tenants[0].id, category: 'lease', name: 'Lease agreement - Kilimani Heights A1.pdf', sizeKb: 842, uploadedAt: daysAgo(160) },
  { id: 'd2', ownerId: landlord.id, propertyId: 'p1', tenantId: tenants[1].id, category: 'lease', name: 'Lease agreement - Kilimani Heights A2.pdf', sizeKb: 790, uploadedAt: daysAgo(120) },
  { id: 'd3', ownerId: landlord.id, propertyId: 'p1', tenantId: tenants[0].id, category: 'receipt', name: 'Rent receipt - September.pdf', sizeKb: 96, uploadedAt: daysAgo(3) },
  { id: 'd4', ownerId: landlord.id, propertyId: 'p2', category: 'notice', name: 'Water maintenance notice.pdf', sizeKb: 120, uploadedAt: daysAgo(1) },
  { id: 'd5', ownerId: landlord.id, propertyId: 'p3', category: 'property', name: 'Athi River Court - title deed copy.pdf', sizeKb: 1520, uploadedAt: daysAgo(300) },
  { id: 'd6', ownerId: landlord.id, propertyId: 'p1', category: 'maintenance', name: 'Plumbing invoice - Njoroge Plumbers.pdf', sizeKb: 210, uploadedAt: daysAgo(2) },
];

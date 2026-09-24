import type {
  ActivityEvent, Document, Lease, MaintenanceRequest, Notice, Payment, Property, Tenant, TimelineEntry, Unit, User,
} from '@/types';
import {
  CURRENT_PERIOD, conversations, documents, leases, maintenanceRequests, notices, notifications,
  payments, properties, tenants, units, users,
} from '@/data/mock';
import { maintenanceStatusMeta } from '@/lib/utils/status';
import type { MaintenanceItem } from './landlord';

// TODO(supabase): every function takes the signed-in tenant's id. With Supabase, RLS makes
// `tenant_id = auth.uid()` the rule, so a tenant can never read another tenant's data.

export interface TenancyInfo { tenant: Tenant; unit: Unit; property: Property; landlord: User; manager?: User; lease: Lease }

export function getTenancy(tenantId: string): TenancyInfo | undefined {
  const tenant = tenants.find((t) => t.id === tenantId);
  const unit = units.find((u) => u.tenantId === tenantId);
  if (!tenant || !unit) return undefined;
  const property = properties.find((p) => p.id === unit.propertyId);
  const lease = leases.find((l) => l.unitId === unit.id && l.tenantId === tenantId);
  const landlord = users.find((u) => u.id === property?.landlordId);
  if (!property || !lease || !landlord) return undefined;
  const manager = property.managerId ? users.find((u) => u.id === property.managerId) : undefined;
  return { tenant, unit, property, landlord, manager, lease };
}

export interface PaymentsSummary {
  tenancy: TenancyInfo;
  payments: Payment[];
  current?: Payment;
  balance: number;
  nextDueDate: string;
  nextAmount: number;
}

export function getPaymentsSummary(tenantId: string): PaymentsSummary | undefined {
  const tenancy = getTenancy(tenantId);
  if (!tenancy) return undefined;
  const mine = payments.filter((p) => p.tenantId === tenantId).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const current = mine.find((p) => p.period === CURRENT_PERIOD);
  const balance = mine
    .filter((p) => p.status === 'overdue' || p.status === 'partial')
    .reduce((total, p) => total + (p.expectedAmount - p.amount), 0);

  let nextDueDate: string;
  let nextAmount: number;
  if (current && current.status !== 'paid') {
    nextDueDate = current.dueDate;
    nextAmount = current.expectedAmount - current.amount;
  } else {
    const now = new Date();
    nextDueDate = new Date(now.getFullYear(), now.getMonth() + 1, tenancy.property.rentDueDay, 12).toISOString();
    nextAmount = tenancy.unit.monthlyRent;
  }
  return { tenancy, payments: mine, current, balance, nextDueDate, nextAmount };
}

export interface TenantHomeData extends PaymentsSummary {
  activity: ActivityEvent[];
  latestReceiptId?: string;
  conversationIds: { landlord?: string; manager?: string };
}

export function getTenantHome(tenantId: string): TenantHomeData | undefined {
  const summary = getPaymentsSummary(tenantId);
  if (!summary) return undefined;
  const landlordId = summary.tenancy.landlord.id;

  const activity: ActivityEvent[] = [];
  notifications.filter((n) => n.userId === tenantId).forEach((n) =>
    activity.push({ id: n.id, landlordId, type: n.type, title: n.title, description: n.body, createdAt: n.createdAt }));
  maintenanceRequests.filter((r) => r.tenantId === tenantId).forEach((r) =>
    activity.push({ id: `act-${r.id}`, landlordId, type: 'maintenance', title: 'Maintenance update', description: `${r.title}: ${maintenanceStatusMeta[r.status].label}`, createdAt: r.createdAt }));
  activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const convWith = (userId?: string) =>
    userId ? conversations.find((c) => c.participantIds.includes(tenantId) && c.participantIds.includes(userId))?.id : undefined;

  return {
    ...summary,
    activity: activity.slice(0, 5),
    latestReceiptId: summary.payments.find((p) => p.status === 'paid' || p.status === 'partial')?.id,
    conversationIds: { landlord: convWith(landlordId), manager: convWith(summary.tenancy.manager?.id) },
  };
}

export function getTenantPayment(paymentId: string, tenantId: string) {
  const payment = payments.find((p) => p.id === paymentId && p.tenantId === tenantId);
  const tenancy = getTenancy(tenantId);
  return payment && tenancy ? { payment, tenancy } : undefined;
}

export function listTenantRequests(tenantId: string): MaintenanceItem[] {
  const tenancy = getTenancy(tenantId);
  if (!tenancy) return [];
  return maintenanceRequests
    .filter((r) => r.tenantId === tenantId)
    .map((request) => ({ request, unit: tenancy.unit, property: tenancy.property }))
    .sort((a, b) => b.request.createdAt.localeCompare(a.request.createdAt));
}

function buildTimeline(r: MaintenanceRequest): TimelineEntry[] {
  const order = ['new', 'assigned', 'in_progress', 'completed'];
  const at = order.indexOf(r.status);
  const base = new Date(r.createdAt).getTime();
  const when = (hours: number) => new Date(Math.min(base + hours * 3_600_000, Date.now())).toISOString();
  return [
    { id: 't1', title: 'Request submitted', description: 'Your landlord has been notified.', at: r.createdAt, done: true },
    { id: 't2', title: 'Assigned to a provider', description: r.assignedProvider ? `${r.assignedProvider} will handle this.` : 'Waiting for your landlord to assign someone.', at: at >= 1 ? when(3) : undefined, done: at >= 1 },
    { id: 't3', title: 'Work in progress', description: 'The provider is on the job.', at: at >= 2 ? when(24) : undefined, done: at >= 2 },
    { id: 't4', title: 'Completed', description: 'The issue has been fixed.', at: at >= 3 ? when(72) : undefined, done: at >= 3 },
  ];
}

export function getTenantRequest(requestId: string, tenantId: string) {
  const item = listTenantRequests(tenantId).find((i) => i.request.id === requestId);
  return item ? { item, timeline: buildTimeline(item.request) } : undefined;
}

export function listTenantDocuments(tenantId: string): Document[] {
  const tenancy = getTenancy(tenantId);
  return documents
    .filter((d) => d.tenantId === tenantId || (d.category === 'notice' && d.propertyId === tenancy?.property.id))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export function listTenantNotices(tenantId: string): Notice[] {
  const tenancy = getTenancy(tenantId);
  return notices.filter((n) => n.propertyId === tenancy?.property.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

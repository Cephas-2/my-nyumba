import type { AccountStatus, Dispute, MaintenanceRequest, Property, PropertyFlag, User } from '@/types';
import {
  CURRENT_PERIOD, disputes, maintenanceRequests, payments, properties, propertyFlags, tenants, units, users,
} from '@/data/mock';
import { maintenanceCategoryLabel } from '@/lib/utils/meta';
import { statsFor, type MaintenanceItem, type PropertyStats } from './landlord';

// TODO(supabase): admin reads go through RPCs / views guarded by an `is_admin()` policy, and every
// admin action (suspend, flag, resolve) should write to an audit_log table. Prefer aggregates over raw
// tenant data: admins rarely need to see individual payment details.

export interface PlatformStats {
  totalUsers: number; landlords: number; tenants: number; managers: number; suspended: number;
  properties: number; units: number; occupiedUnits: number; activeRequests: number;
  openDisputes: number; flaggedProperties: number;
}

export function getPlatformStats(): PlatformStats {
  const count = (role: User['role']) => users.filter((u) => u.role === role).length;
  return {
    totalUsers: users.length, landlords: count('landlord'), tenants: count('tenant'), managers: count('property_manager'),
    suspended: users.filter((u) => u.status === 'suspended').length,
    properties: properties.filter((p) => !p.archived).length,
    units: units.length, occupiedUnits: units.filter((u) => u.status === 'occupied').length,
    activeRequests: maintenanceRequests.filter((r) => r.status !== 'completed').length,
    openDisputes: disputes.filter((d) => d.status === 'open').length,
    flaggedProperties: new Set(propertyFlags.map((f) => f.propertyId)).size,
  };
}

export function listUsers(): User[] {
  return [...users].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUserDetail(id: string) {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  const owned = properties.filter((p) => p.landlordId === id);
  const unit = units.find((u) => u.tenantId === id);
  const tenancyProperty = unit ? properties.find((p) => p.id === unit.propertyId) : undefined;
  return {
    user,
    ownedProperties: owned,
    ownedUnits: units.filter((u) => owned.some((p) => p.id === u.propertyId)).length,
    tenancy: unit && tenancyProperty ? { unit, property: tenancyProperty } : undefined,
    requestCount: maintenanceRequests.filter((r) => r.tenantId === id).length,
  };
}

export function setUserStatus(id: string, status: AccountStatus): void {
  const user = users.find((u) => u.id === id);
  if (user && user.role !== 'admin') user.status = status;
}

export interface AdminProperty { property: Property; owner?: User; stats: PropertyStats; flags: PropertyFlag[] }

function toAdminProperty(property: Property): AdminProperty {
  return {
    property,
    owner: users.find((u) => u.id === property.landlordId),
    stats: statsFor(property.id),
    flags: propertyFlags.filter((f) => f.propertyId === property.id),
  };
}

export function listAllProperties(): AdminProperty[] {
  return properties.filter((p) => !p.archived).map(toAdminProperty);
}

export function getAdminProperty(id: string) {
  const property = properties.find((p) => p.id === id);
  if (!property) return undefined;
  return {
    ...toAdminProperty(property),
    openRequests: maintenanceRequests.filter((r) => r.propertyId === id && r.status !== 'completed').length,
  };
}

export function flagProperty(propertyId: string, reason: string, note: string, reportedBy: string): void {
  propertyFlags.push({ id: `fl-${Date.now()}`, propertyId, reason, note: note.trim() || undefined, reportedBy, createdAt: new Date().toISOString() });
}

export function clearFlags(propertyId: string): void {
  for (let i = propertyFlags.length - 1; i >= 0; i--) if (propertyFlags[i].propertyId === propertyId) propertyFlags.splice(i, 1);
}

export interface AdminRequest extends MaintenanceItem { dispute?: Dispute }

function toAdminRequest(request: MaintenanceRequest): AdminRequest | undefined {
  const unit = units.find((u) => u.id === request.unitId);
  const property = properties.find((p) => p.id === request.propertyId);
  if (!unit || !property) return undefined;
  return { request, unit, property, tenant: tenants.find((t) => t.id === request.tenantId), dispute: disputes.find((d) => d.requestId === request.id) };
}

export function listAllRequests(): AdminRequest[] {
  const out: AdminRequest[] = [];
  maintenanceRequests.forEach((r) => { const a = toAdminRequest(r); if (a) out.push(a); });
  return out.sort((a, b) => b.request.createdAt.localeCompare(a.request.createdAt));
}

export function listDisputes(): AdminRequest[] {
  return listAllRequests().filter((r) => r.dispute).sort((a, b) => (b.dispute?.createdAt ?? '').localeCompare(a.dispute?.createdAt ?? ''));
}

export function getAdminRequest(id: string) {
  const request = maintenanceRequests.find((r) => r.id === id);
  const item = request ? toAdminRequest(request) : undefined;
  if (!item) return undefined;
  return { ...item, owner: users.find((u) => u.id === item.property.landlordId) };
}

export function resolveDispute(id: string): void {
  const dispute = disputes.find((d) => d.id === id);
  if (dispute) dispute.status = 'resolved';
}

export function getPlatformReports() {
  const now = new Date();
  const signups = [5, 4, 3, 2, 1, 0].map((offset) => {
    const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
    return {
      label: start.toLocaleDateString('en-GB', { month: 'short' }),
      value: users.filter((u) => { const t = new Date(u.createdAt).getTime(); return t >= start.getTime() && t < end.getTime(); }).length,
    };
  });

  const byCategory = new Map<string, number>();
  maintenanceRequests.forEach((r) => byCategory.set(maintenanceCategoryLabel[r.category], (byCategory.get(maintenanceCategoryLabel[r.category]) ?? 0) + 1));
  const byCity = new Map<string, number>();
  properties.filter((p) => !p.archived).forEach((p) => byCity.set(p.location.city, (byCity.get(p.location.city) ?? 0) + 1));
  const toSeries = (m: Map<string, number>) => [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

  const current = payments.filter((p) => p.period === CURRENT_PERIOD);
  const rentStatus = { paid: 0, partial: 0, pending: 0, overdue: 0 };
  current.forEach((p) => { rentStatus[p.status] += 1; });
  const expected = current.reduce((t, p) => t + p.expectedAmount, 0);
  const collected = current.reduce((t, p) => t + p.amount, 0);
  const occupied = units.filter((u) => u.status === 'occupied').length;

  return {
    signups,
    requestsByCategory: toSeries(byCategory),
    propertiesByCity: toSeries(byCity),
    rentStatus: [
      { label: 'Paid', value: rentStatus.paid }, { label: 'Partial', value: rentStatus.partial },
      { label: 'Pending', value: rentStatus.pending }, { label: 'Overdue', value: rentStatus.overdue },
    ],
    expected, collected,
    occupancyRate: units.length ? Math.round((occupied / units.length) * 100) : 0,
    totalRequests: maintenanceRequests.length,
  };
}

import {
  CURRENT_PERIOD,
  activityEvents,
  conversations,
  leases,
  maintenanceRequests,
  payments,
  properties,
  tenants,
  units,
} from "@/data/mock";
import type {
  ActivityEvent,
  Lease,
  MaintenanceRequest,
  Payment,
  PaymentStatus,
  Property,
  Tenant,
  Unit,
} from "@/types";

// TODO(supabase): replace every function here with a Supabase query. Row Level Security must
// guarantee that a landlord can only read rows belonging to properties they own (or manage).

export type RentStatusCounts = Record<PaymentStatus, number>;

export interface PropertyStats {
  totalUnits: number;
  occupied: number;
  vacant: number;
  underMaintenance: number;
  expectedRent: number;
  collected: number;
  outstanding: number;
  occupancyRate: number;
}
export interface PropertyWithStats {
  property: Property;
  stats: PropertyStats;
}
export interface PortfolioSummary {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  expectedRent: number;
  collected: number;
  outstanding: number;
  rentStatus: RentStatusCounts;
}
export interface TenantRecord {
  tenant: Tenant;
  unit: Unit;
  property: Property;
  lease: Lease;
  payment?: Payment;
}
export interface MaintenanceItem {
  request: MaintenanceRequest;
  tenant?: Tenant;
  unit: Unit;
  property: Property;
}
export interface UnitRecord {
  unit: Unit;
  tenant?: Tenant;
  payment?: Payment;
}

const sum = <T>(items: T[], pick: (item: T) => number) =>
  items.reduce((total, item) => total + pick(item), 0);
const ownedProperties = (landlordId: string) =>
  properties.filter((p) => p.landlordId === landlordId && !p.archived);

export function statsFor(propertyId: string): PropertyStats {
  const us = units.filter((u) => u.propertyId === propertyId);
  const current = payments.filter(
    (p) => p.propertyId === propertyId && p.period === CURRENT_PERIOD,
  );
  const expectedRent = sum(current, (p) => p.expectedAmount);
  const collected = sum(current, (p) => p.amount);
  const occupied = us.filter((u) => u.status === "occupied").length;
  return {
    totalUnits: us.length,
    occupied,
    vacant: us.filter((u) => u.status === "vacant").length,
    underMaintenance: us.filter((u) => u.status === "maintenance").length,
    expectedRent,
    collected,
    outstanding: expectedRent - collected,
    occupancyRate: us.length ? Math.round((occupied / us.length) * 100) : 0,
  };
}

export function listLandlordProperties(
  landlordId: string,
): PropertyWithStats[] {
  return ownedProperties(landlordId).map((property) => ({
    property,
    stats: statsFor(property.id),
  }));
}

export function getPropertyForEdit(id: string) {
  const property = properties.find((p) => p.id === id);
  if (!property) return undefined;
  return {
    property,
    unitCount: units.filter((u) => u.propertyId === id).length,
  };
}

export function getPortfolioSummary(landlordId: string): PortfolioSummary {
  const props = ownedProperties(landlordId);
  const ids = new Set(props.map((p) => p.id));
  const us = units.filter((u) => ids.has(u.propertyId));
  const current = payments.filter(
    (p) => ids.has(p.propertyId) && p.period === CURRENT_PERIOD,
  );
  const rentStatus: RentStatusCounts = {
    paid: 0,
    partial: 0,
    pending: 0,
    overdue: 0,
  };
  current.forEach((p) => {
    rentStatus[p.status] += 1;
  });
  const expectedRent = sum(current, (p) => p.expectedAmount);
  const collected = sum(current, (p) => p.amount);
  return {
    totalProperties: props.length,
    totalUnits: us.length,
    occupiedUnits: us.filter((u) => u.status === "occupied").length,
    vacantUnits: us.filter((u) => u.status === "vacant").length,
    expectedRent,
    collected,
    outstanding: expectedRent - collected,
    rentStatus,
  };
}

export function getRecentActivity(
  landlordId: string,
  limit = 6,
  propertyId?: string,
): ActivityEvent[] {
  return activityEvents
    .filter(
      (e) =>
        e.landlordId === landlordId &&
        (!propertyId || e.propertyId === propertyId),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

function toTenantRecord(lease: Lease): TenantRecord | undefined {
  const tenant = tenants.find((t) => t.id === lease.tenantId);
  const unit = units.find((u) => u.id === lease.unitId);
  const property = properties.find((p) => p.id === lease.propertyId);
  if (!tenant || !unit || !property) return undefined;
  const payment = payments.find(
    (p) => p.unitId === unit.id && p.period === CURRENT_PERIOD,
  );
  return { tenant, unit, property, lease, payment };
}

export function listLandlordTenants(
  landlordId: string,
  propertyId?: string,
): TenantRecord[] {
  const ids = new Set(ownedProperties(landlordId).map((p) => p.id));
  const records: TenantRecord[] = [];
  leases.forEach((lease) => {
    if (
      !ids.has(lease.propertyId) ||
      (propertyId && lease.propertyId !== propertyId)
    )
      return;
    const record = toTenantRecord(lease);
    if (record) records.push(record);
  });
  return records.sort((a, b) =>
    a.tenant.fullName.localeCompare(b.tenant.fullName),
  );
}

export function listLandlordMaintenance(
  landlordId: string,
  propertyId?: string,
): MaintenanceItem[] {
  const ids = new Set(ownedProperties(landlordId).map((p) => p.id));
  const items: MaintenanceItem[] = [];
  maintenanceRequests.forEach((request) => {
    if (
      !ids.has(request.propertyId) ||
      (propertyId && request.propertyId !== propertyId)
    )
      return;
    const unit = units.find((u) => u.id === request.unitId);
    const property = properties.find((p) => p.id === request.propertyId);
    if (!unit || !property) return;
    items.push({
      request,
      unit,
      property,
      tenant: tenants.find((t) => t.id === request.tenantId),
    });
  });
  return items.sort((a, b) =>
    b.request.createdAt.localeCompare(a.request.createdAt),
  );
}

export function getPropertyDetail(propertyId: string) {
  const property = properties.find((p) => p.id === propertyId);
  if (!property) return undefined;
  const unitRecords: UnitRecord[] = units
    .filter((u) => u.propertyId === propertyId)
    .map((unit) => ({
      unit,
      tenant: tenants.find((t) => t.id === unit.tenantId),
      payment: payments.find(
        (p) => p.unitId === unit.id && p.period === CURRENT_PERIOD,
      ),
    }));
  return {
    property,
    stats: statsFor(propertyId),
    units: unitRecords,
    tenants: listLandlordTenants(property.landlordId, propertyId),
    requests: listLandlordMaintenance(property.landlordId, propertyId),
    payments: payments.filter(
      (p) => p.propertyId === propertyId && p.period === CURRENT_PERIOD,
    ),
    activity: getRecentActivity(property.landlordId, 4, propertyId),
  };
}

export function getUnreadMessageCount(userId: string): number {
  return conversations
    .filter((c) => c.participantIds.includes(userId))
    .reduce((total, c) => total + c.unreadCount, 0);
}

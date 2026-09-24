import type { Lease, LeaseStatus, Property, PropertyType, Unit, UnitStatus } from '@/types';
import { addDays, daysAgo, daysBetween } from '@/lib/utils/date';
import { landlord, landlord2, tenants } from './users';

interface Seed {
  id: string; landlordId: string; name: string; type: PropertyType; area: string; city: string;
  description: string; unitCount: number; prefix: string; baseRent: number; dueDay: number;
}

const seeds: Seed[] = [
  { id: 'p1', landlordId: landlord.id, name: 'Kilimani Heights', type: 'apartment', area: 'Kilimani', city: 'Nairobi',
    description: 'Eight-unit apartment block near Yaya Centre with a borehole, backup generator and secure parking.',
    unitCount: 8, prefix: 'A', baseRent: 45000, dueDay: 5 },
  { id: 'p2', landlordId: landlord.id, name: 'Ruaka Gardens', type: 'maisonette', area: 'Ruaka', city: 'Kiambu',
    description: 'Gated maisonette estate with a children\'s play area, 24-hour security and reliable water supply.',
    unitCount: 6, prefix: 'B', baseRent: 85000, dueDay: 1 },
  { id: 'p3', landlordId: landlord.id, name: 'Athi River Court', type: 'apartment', area: 'Athi River', city: 'Machakos',
    description: 'Affordable one- and two-bedroom units close to the Mombasa Road corridor and the EPZ.',
    unitCount: 6, prefix: 'C', baseRent: 18000, dueDay: 7 },
  { id: 'p4', landlordId: landlord.id, name: 'Nyali Sea View', type: 'apartment', area: 'Nyali', city: 'Mombasa',
    description: 'Coastal apartments a short walk from Nyali Beach, with a shared pool and ocean breeze on every floor.',
    unitCount: 6, prefix: 'D', baseRent: 60000, dueDay: 28 },
  { id: 'p5', landlordId: landlord2.id, name: 'Milimani Court', type: 'townhouse', area: 'Milimani', city: 'Kisumu',
    description: 'Four townhouses in a quiet part of Milimani, a few minutes from Kisumu CBD and the lakefront.',
    unitCount: 4, prefix: 'E', baseRent: 40000, dueDay: 5 },
];

export const properties: Property[] = seeds.map((s, i): Property => ({
  id: s.id, landlordId: s.landlordId, name: s.name, type: s.type,
  location: { area: s.area, city: s.city, country: 'Kenya' },
  description: s.description, rentDueDay: s.dueDay, archived: false, createdAt: daysAgo(400 - i * 60),
}));

export const units: Unit[] = [];
export const leases: Lease[] = [];

let tenantCursor = 0;
seeds.forEach((seed, seedIndex) => {
  for (let i = 0; i < seed.unitCount; i++) {
    const id = `${seed.id}-${seed.prefix}${i + 1}`;
    const rent = Math.round((seed.baseRent + (i % 3) * seed.baseRent * 0.15) / 500) * 500;
    const status: UnitStatus = i % 5 === 4 ? 'vacant' : i === 6 ? 'maintenance' : 'occupied';
    const tenant = status === 'occupied' ? tenants[tenantCursor++] : undefined;

    units.push({
      id, propertyId: seed.id, unitNumber: `${seed.prefix}${i + 1}`, bedrooms: 1 + (i % 3),
      status, monthlyRent: rent, deposit: rent, tenantId: tenant?.id,
    });

    if (tenant) {
      const startDate = daysAgo(((i * 97 + seedIndex * 41) % 330) + 30);
      const endDate = addDays(startDate, 365);
      const remaining = daysBetween(new Date().toISOString(), endDate);
      const leaseStatus: LeaseStatus = remaining <= 0 ? 'expired' : remaining <= 60 ? 'expiring' : 'active';
      leases.push({
        id: `l-${id}`, propertyId: seed.id, unitId: id, tenantId: tenant.id,
        startDate, endDate, monthlyRent: rent, deposit: rent, status: leaseStatus,
      });
    }
  }
});

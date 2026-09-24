import type {
  MaintenanceCategory, MaintenancePriority, MaintenanceRequest, MaintenanceStatus,
} from '@/types';
import { daysAgo, hoursAgo } from '@/lib/utils/date';
import { units } from './properties';

function req(
  id: string, unitId: string, title: string, description: string,
  category: MaintenanceCategory, priority: MaintenancePriority, status: MaintenanceStatus,
  createdAt: string, extra: Partial<Pick<MaintenanceRequest, 'assignedProvider' | 'cost'>> = {},
): MaintenanceRequest {
  const unit = units.find((u) => u.id === unitId);
  if (!unit || !unit.tenantId) throw new Error(`Mock data error: unit ${unitId} has no tenant`);
  return { id, propertyId: unit.propertyId, unitId, tenantId: unit.tenantId, title, description, category, priority, status, createdAt, ...extra };
}

export const maintenanceRequests: MaintenanceRequest[] = [
  req('m1', 'p2-B1', 'No running water since morning', 'The taps have been dry since 6am. Neighbours report the same, so it may be the main tank.', 'water', 'urgent', 'new', hoursAgo(3)),
  req('m2', 'p1-A2', 'Leaking kitchen tap', 'The kitchen mixer drips constantly and the cupboard below is now damp.', 'plumbing', 'medium', 'in_progress', daysAgo(2), { assignedProvider: 'Njoroge Plumbers', cost: 3500 }),
  req('m3', 'p1-A1', 'Bedroom sockets not working', 'Two sockets in the master bedroom have no power. Other rooms are fine.', 'electricity', 'high', 'assigned', daysAgo(1), { assignedProvider: 'BrightSpark Electricals' }),
  req('m4', 'p3-C2', 'Broken window latch', 'The living room window will not lock properly.', 'security', 'medium', 'new', daysAgo(1)),
  req('m5', 'p4-D2', 'Fibre internet keeps disconnecting', 'The router drops the connection every evening. The provider says the line inside the building needs checking.', 'internet', 'low', 'assigned', daysAgo(4), { assignedProvider: 'Coastline Networks' }),
  req('m6', 'p1-A4', 'Fridge not cooling', 'The landlord-provided fridge stopped cooling two days ago.', 'appliance', 'high', 'in_progress', daysAgo(3), { assignedProvider: 'CoolTech Appliances', cost: 6000 }),
  req('m7', 'p2-B3', 'Security light at gate is out', 'The security light near block B has been off for a week.', 'security', 'medium', 'completed', daysAgo(9), { assignedProvider: 'BrightSpark Electricals', cost: 2500 }),
  req('m8', 'p4-D3', 'Blocked bathroom drain', 'Water drains very slowly in the shower.', 'plumbing', 'medium', 'completed', daysAgo(12), { assignedProvider: 'Mvita Plumbing Works', cost: 4000 }),
  req('m9', 'p3-C4', 'Cracked ceiling paint in bedroom', 'Paint is peeling near the ceiling after last month\'s rain.', 'other', 'low', 'new', daysAgo(5)),
  req('m10', 'p5-E1', 'Geyser trips the power', 'The water heater trips the main switch whenever it is turned on.', 'electricity', 'high', 'new', hoursAgo(20)),
];

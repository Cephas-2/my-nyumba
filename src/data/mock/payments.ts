import type { Payment, PaymentMethod } from '@/types';
import { properties, units } from './properties';

const now = new Date();
const monthDate = (offset: number, day: number) => new Date(now.getFullYear(), now.getMonth() - offset, day, 12);
const periodOf = (offset: number) => {
  const d = monthDate(offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
const reference = (seed: number) =>
  `S${Math.abs((seed + 1) * 2654435761 % 999999937).toString(36).toUpperCase().padStart(9, 'K')}`;

export const CURRENT_PERIOD = periodOf(0);
export const payments: Payment[] = [];

let n = 0;
for (const unit of units) {
  if (unit.status !== 'occupied' || !unit.tenantId) continue;
  const dueDay = properties.find((p) => p.id === unit.propertyId)?.rentDueDay ?? 5;

  for (const offset of [2, 1, 0]) {
    const due = monthDate(offset, dueDay);
    const pastDue = due.getTime() <= now.getTime();
    const outcome = offset > 0 ? 'paid' : n % 5 === 3 ? 'unpaid' : n % 7 === 5 ? 'partial' : 'paid';
    const method: PaymentMethod = n % 9 === 0 ? 'cash' : n % 3 === 0 ? 'bank' : 'mpesa';
    const ref = method === 'cash' ? undefined : reference(n * 10 + offset);
    const base = {
      id: `pay-${unit.id}-${periodOf(offset)}`, tenantId: unit.tenantId, unitId: unit.id,
      propertyId: unit.propertyId, period: periodOf(offset), expectedAmount: unit.monthlyRent,
      dueDate: due.toISOString(),
    };

    if (outcome === 'paid') {
      const paidAt = new Date(Math.min(due.getTime() - (n % 4) * 86_400_000, now.getTime()));
      payments.push({ ...base, amount: unit.monthlyRent, paidDate: paidAt.toISOString(), method, reference: ref, status: 'paid' });
    } else if (outcome === 'partial') {
      const paidAt = new Date(Math.min(due.getTime(), now.getTime()));
      payments.push({
        ...base, amount: Math.round((unit.monthlyRent * 0.6) / 500) * 500, paidDate: paidAt.toISOString(),
        method: 'mpesa', reference: reference(n * 10 + offset), status: 'partial',
        notes: 'Balance promised by end of month',
      });
    } else {
      payments.push({ ...base, amount: 0, status: pastDue ? 'overdue' : 'pending' });
    }
  }
  n++;
}

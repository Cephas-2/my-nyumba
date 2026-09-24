import type { Landlord, Tenant, User } from '@/types';
import { daysAgo } from '@/lib/utils/date';

export const landlord: Landlord = {
  id: 'u-landlord-1', role: 'landlord', fullName: 'Wanjiru Kamau', email: 'wanjiru.kamau@example.com',
  phone: '0712 345 678', status: 'active', createdAt: daysAgo(420), businessName: 'Kamau Properties',
};
export const landlord2: Landlord = {
  id: 'u-landlord-2', role: 'landlord', fullName: 'Hassan Bakari', email: 'hassan.bakari@example.com',
  phone: '0733 210 987', status: 'active', createdAt: daysAgo(210), businessName: 'Bakari Estates',
};
export const admin: User = {
  id: 'u-admin-1', role: 'admin', fullName: 'Achieng Odhiambo', email: 'admin@mynyumba.app',
  phone: '0700 111 222', status: 'active', createdAt: daysAgo(600),
};

const TENANT_NAMES = [
  'Brian Otieno', 'Faith Njeri', 'Kevin Mutua', 'Grace Achieng', 'Peter Kariuki', 'Mercy Wambui',
  'Hassan Mwinyi', 'Amina Salim', 'Daniel Kiprop', 'Lucy Wanjiku', 'James Ochieng', 'Esther Mwikali',
  'Samuel Kimani', 'Joyce Atieno', 'Abdi Hussein', 'Naomi Chebet', 'Victor Omondi', 'Sharon Nyambura',
  'Collins Mwangi', 'Ruth Akinyi', 'Moses Njoroge', 'Cynthia Adhiambo', 'Yusuf Ali', 'Beatrice Wairimu',
  'Dennis Barasa', 'Purity Kemunto',
];
const KIN_FIRST = ['Mary', 'John', 'Alice', 'Joseph'];
const KIN_RELATION = ['Mother', 'Brother', 'Sister', 'Father'];

export const tenants: Tenant[] = TENANT_NAMES.map((fullName, i): Tenant => {
  const [first, ...rest] = fullName.split(' ');
  const last = rest.join(' ');
  return {
    id: `u-tenant-${i + 1}`,
    role: 'tenant',
    fullName,
    email: `${first}.${last}`.toLowerCase().replace(/\s+/g, '') + '@example.com',
    phone: `07${20 + i} ${String(100 + i * 37).padStart(3, '0')} ${String(300 + i * 53).padStart(3, '0')}`,
    status: i === 25 ? 'suspended' : 'active',
    createdAt: daysAgo(30 + i * 11),
    emergencyContact: {
      name: `${KIN_FIRST[i % 4]} ${last}`,
      relationship: KIN_RELATION[i % 4],
      phone: `0722 ${String(400 + i * 17).padStart(3, '0')} ${String(500 + i * 29).padStart(3, '0')}`,
    },
  };
});

export const users: User[] = [landlord, landlord2, admin, ...tenants];

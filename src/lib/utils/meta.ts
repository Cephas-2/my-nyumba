import type { IconName } from '@/components/ui/Icon';
import type { Tone } from '@/constants/theme';
import type { AccountStatus, MaintenanceCategory, PaymentMethod, UserRole } from '@/types';
import type { StatusMeta } from './status';

export const roleMeta: Record<UserRole, { label: string; tone: Tone; icon: IconName }> = {
  landlord: { label: 'Landlord', tone: 'primary', icon: 'business-outline' },
  tenant: { label: 'Tenant', tone: 'info', icon: 'home-outline' },
  property_manager: { label: 'Property manager', tone: 'warning', icon: 'briefcase-outline' },
  service_provider: { label: 'Service provider', tone: 'neutral', icon: 'hammer-outline' },
  admin: { label: 'Admin', tone: 'danger', icon: 'shield-checkmark-outline' },
};

export const accountStatusMeta: Record<AccountStatus, StatusMeta> = {
  active: { label: 'Active', tone: 'success', icon: 'checkmark-circle' },
  suspended: { label: 'Suspended', tone: 'danger', icon: 'ban' },
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  mpesa: 'M-Pesa', bank: 'Bank transfer', cash: 'Cash', other: 'Other',
};

export const maintenanceCategoryLabel: Record<MaintenanceCategory, string> = {
  plumbing: 'Plumbing', electricity: 'Electricity', water: 'Water', internet: 'Internet',
  security: 'Security', appliance: 'Appliance', other: 'Other',
};

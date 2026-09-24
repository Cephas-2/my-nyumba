import type { IconName } from '@/components/ui/Icon';
import type { Tone } from '@/constants/theme';
import type {
  LeaseStatus, MaintenancePriority, MaintenanceStatus, PaymentStatus, UnitStatus,
} from '@/types';

export interface StatusMeta {
  label: string;
  tone: Tone;
  icon: IconName;
}

// Every status has a label AND an icon so meaning never relies on colour alone.
export const paymentStatusMeta: Record<PaymentStatus, StatusMeta> = {
  paid: { label: 'Paid', tone: 'success', icon: 'checkmark-circle' },
  partial: { label: 'Partial', tone: 'warning', icon: 'pie-chart-outline' },
  pending: { label: 'Pending', tone: 'info', icon: 'hourglass-outline' },
  overdue: { label: 'Overdue', tone: 'danger', icon: 'alert-circle' },
};
export const unitStatusMeta: Record<UnitStatus, StatusMeta> = {
  occupied: { label: 'Occupied', tone: 'success', icon: 'person' },
  vacant: { label: 'Vacant', tone: 'info', icon: 'key-outline' },
  maintenance: { label: 'Maintenance', tone: 'warning', icon: 'construct' },
};
export const maintenanceStatusMeta: Record<MaintenanceStatus, StatusMeta> = {
  new: { label: 'New', tone: 'info', icon: 'flag-outline' },
  assigned: { label: 'Assigned', tone: 'primary', icon: 'person-add-outline' },
  in_progress: { label: 'In progress', tone: 'warning', icon: 'build-outline' },
  completed: { label: 'Completed', tone: 'success', icon: 'checkmark-done' },
};
export const priorityMeta: Record<MaintenancePriority, StatusMeta> = {
  low: { label: 'Low', tone: 'neutral', icon: 'arrow-down' },
  medium: { label: 'Medium', tone: 'info', icon: 'remove' },
  high: { label: 'High', tone: 'warning', icon: 'arrow-up' },
  urgent: { label: 'Urgent', tone: 'danger', icon: 'warning' },
};
export const leaseStatusMeta: Record<LeaseStatus, StatusMeta> = {
  active: { label: 'Lease active', tone: 'success', icon: 'document-text-outline' },
  expiring: { label: 'Expiring soon', tone: 'warning', icon: 'time-outline' },
  expired: { label: 'Expired', tone: 'danger', icon: 'close-circle-outline' },
  terminated: { label: 'Terminated', tone: 'neutral', icon: 'ban-outline' },
};

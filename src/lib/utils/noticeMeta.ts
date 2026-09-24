import type { IconName } from '@/components/ui/Icon';
import type { Tone } from '@/constants/theme';
import type { NoticeCategory } from '@/types';

export const noticeCategoryMeta: Record<NoticeCategory, { label: string; tone: Tone; icon: IconName }> = {
  general: { label: 'Announcement', tone: 'info', icon: 'megaphone-outline' },
  rent_reminder: { label: 'Rent reminder', tone: 'primary', icon: 'cash-outline' },
  maintenance: { label: 'Maintenance', tone: 'warning', icon: 'construct-outline' },
  emergency: { label: 'Emergency', tone: 'danger', icon: 'alert-circle' },
};

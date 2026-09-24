import type { UserRole } from '@/types';

// Central place that decides where each role lands after sign-in.
export function homeRouteFor(role: UserRole): string {
  switch (role) {
    case 'landlord':
      return '/landlord/home';
    case 'tenant':
      return '/tenant/home';
    case 'admin':
      return '/admin/overview';
    default:
      return `/coming-soon?title=${encodeURIComponent(role.replace('_', ' ') + ' app')}`;
  }
}

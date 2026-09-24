import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from './EmptyState';
import { ScreenContainer } from './ScreenContainer';

// Placeholder used for routes that are scheduled for a later build step.
export function ComingSoon({ title }: { title: string }) {
  return (
    <ScreenContainer header={<AppHeader title={title} showBack />}>
      <EmptyState icon="construct-outline" title={`${title} is coming next`} message="This screen is planned for the next build step. Navigation to it already works." />
    </ScreenContainer>
  );
}

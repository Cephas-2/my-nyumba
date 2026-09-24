import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { spacing } from '@/constants/theme';
import { NotificationItem } from '@/components/cards/NotificationItem';
import { AppHeader } from '@/components/navigation/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { noticeCategoryMeta } from '@/lib/utils/noticeMeta';
import { listTenantNotices } from '@/services/tenant';
import type { NoticeCategory } from '@/types';

type Filter = 'all' | NoticeCategory;
const FILTERS: Filter[] = ['all', 'rent_reminder', 'general', 'maintenance', 'emergency'];

export default function TenantNoticesScreen() {
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, error, refetch } = useMockQuery(`tenant-notices-${tenantId}`, () => listTenantNotices(tenantId));
  const [filter, setFilter] = useState<Filter>('all');
  const visible = (data ?? []).filter((n) => filter === 'all' || n.category === filter);

  return (
    <ScreenContainer header={<AppHeader title="Notices" showBack />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
        {FILTERS.map((f) => <FilterButton key={f} label={f === 'all' ? 'All' : noticeCategoryMeta[f].label} selected={filter === f} onPress={() => setFilter(f)} />)}
      </ScrollView>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : visible.length === 0 ? (
        <EmptyState icon="megaphone-outline" title="No notices" message="Announcements from your landlord will appear here." />
      ) : (
        <View style={{ gap: spacing.md }}>
          {visible.map((n) => {
            const m = noticeCategoryMeta[n.category];
            return <NotificationItem key={n.id} title={n.title} body={n.body} createdAt={n.createdAt} icon={m.icon} tone={m.tone} label={m.label} />;
          })}
        </View>
      )}
    </ScreenContainer>
  );
}

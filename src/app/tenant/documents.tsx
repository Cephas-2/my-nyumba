import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { spacing, colors, radius } from '@/constants/theme';
import { DocumentCard, documentCategoryLabel } from '@/components/cards/DocumentCard';
import { AppHeader } from '@/components/navigation/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterButton } from '@/components/ui/FilterButton';
import { Icon } from '@/components/ui/Icon';
import { LoadingState } from '@/components/ui/LoadingState';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { useMockQuery } from '@/hooks/useMockQuery';
import { useSession } from '@/hooks/useSession';
import { formatDate, formatFileSize } from '@/lib/utils/format';
import { listTenantDocuments } from '@/services/tenant';
import type { Document } from '@/types';

type Filter = 'all' | 'lease' | 'receipt' | 'notice' | 'other';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'lease', label: 'Lease' }, { key: 'receipt', label: 'Receipts' }, { key: 'notice', label: 'Notices' }, { key: 'other', label: 'Other' },
];
const bucket = (d: Document): Filter => (d.category === 'lease' || d.category === 'receipt' || d.category === 'notice' ? d.category : 'other');

export default function TenantDocumentsScreen() {
  const { user } = useSession();
  const tenantId = user?.id ?? '';
  const { data, error, refetch } = useMockQuery(`tenant-docs-${tenantId}`, () => listTenantDocuments(tenantId));
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Document | null>(null);
  const visible = (data ?? []).filter((d) => filter === 'all' || bucket(d) === filter);

  return (
    <ScreenContainer header={<AppHeader title="Documents" showBack />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.lg }}>
        {FILTERS.map((f) => <FilterButton key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />)}
      </ScrollView>
      {error ? <ErrorState message={error} onRetry={refetch} /> : !data ? <LoadingState /> : visible.length === 0 ? (
        <EmptyState icon="document-text-outline" title="No documents" message="Your lease, receipts and notices will be filed here." />
      ) : (
        <View style={{ gap: spacing.md }}>{visible.map((d) => <DocumentCard key={d.id} document={d} onPress={() => setOpen(d)} />)}</View>
      )}

      <BottomSheet visible={!!open} onClose={() => setOpen(null)} title={open?.name}>
        <View style={styles.sheet}>
          <View style={styles.preview}>
            <Icon name="document-text-outline" size={40} color={colors.textMuted} />
            <AppText variant="caption" color={colors.textMuted}>Preview coming soon</AppText>
          </View>
          {open ? <AppText color={colors.textMuted}>{documentCategoryLabel[open.category]} · {formatFileSize(open.sizeKb)} · {formatDate(open.uploadedAt)}</AppText> : null}
          <Button label="Download" icon="download-outline" onPress={() => Alert.alert('Coming later', 'Downloads will use signed URLs from Supabase Storage.')} />
        </View>
      </BottomSheet>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sheet: { paddingHorizontal: spacing.lg, gap: spacing.md },
  preview: { height: 150, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
});

import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { formatDate, formatFileSize } from '@/lib/utils/format';
import type { Document, DocumentCategory } from '@/types';

export const documentCategoryLabel: Record<DocumentCategory, string> = {
  lease: 'Lease', receipt: 'Receipt', notice: 'Notice', property: 'Property document', maintenance: 'Maintenance document',
};

export function DocumentCard({ document, onPress }: { document: Document; onPress?: () => void }) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${document.name}, ${documentCategoryLabel[document.category]}`}>
      <View style={styles.row}>
        <View style={styles.icon}><Icon name="document-text-outline" size={22} color={colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" numberOfLines={2}>{document.name}</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {documentCategoryLabel[document.category]} · {formatFileSize(document.sizeKb)} · {formatDate(document.uploadedAt)}
          </AppText>
        </View>
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});

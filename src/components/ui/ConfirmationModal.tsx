import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface Props {
  visible: boolean; title: string; message: string;
  confirmLabel?: string; cancelLabel?: string; destructive?: boolean;
  onConfirm: () => void; onCancel: () => void;
}

export function ConfirmationModal({ visible, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', destructive, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.wrap}>
        <Pressable style={styles.backdrop} onPress={onCancel} accessibilityLabel="Dismiss" />
        <View style={styles.dialog} accessibilityViewIsModal>
          <AppText variant="heading">{title}</AppText>
          <AppText color={colors.textMuted}>{message}</AppText>
          <View style={styles.actions}>
            <Button label={confirmLabel} onPress={onConfirm} variant={destructive ? 'danger' : 'primary'} />
            <Button label={cancelLabel} onPress={onCancel} variant="secondary" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlay },
  dialog: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
});

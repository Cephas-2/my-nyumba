import { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, layout, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { ScreenContainer } from '@/components/ui/ScreenContainer';

const SLIDES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'business-outline', title: 'Manage your properties', body: 'Keep every property, unit and lease organised in one place, whether you own one home or twenty.' },
  { icon: 'chatbubbles-outline', title: 'Stay connected with tenants', body: 'Share notices, answer questions and keep every conversation about the property together.' },
  { icon: 'construct-outline', title: 'Keep rent and maintenance organised', body: 'Track payments and follow each maintenance request from the first report to the final fix.' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const slideWidth = width - layout.screenPadding * 2;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / slideWidth));

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.top}><Logo /></View>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={onScrollEnd}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: slideWidth }]}>
            <View style={styles.iconWrap}><Icon name={item.icon} size={56} color={colors.primary} /></View>
            <AppText variant="display" align="center">{item.title}</AppText>
            <AppText color={colors.textMuted} align="center">{item.body}</AppText>
          </View>
        )}
      />
      <View style={styles.dots} accessibilityLabel={`Page ${index + 1} of ${SLIDES.length}`}>
        {SLIDES.map((s, i) => <View key={s.title} style={[styles.dot, i === index && styles.dotActive]} />)}
      </View>
      <View style={styles.actions}>
        <Button label="Get Started" onPress={() => router.push('/create-account')} />
        <Button label="Sign In" variant="secondary" onPress={() => router.push('/sign-in')} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: { paddingTop: spacing.lg, alignItems: 'flex-start' },
  slide: { alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingTop: spacing.xxxl, paddingHorizontal: spacing.md },
  iconWrap: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  actions: { gap: spacing.md, marginTop: 'auto', paddingBottom: spacing.lg },
});

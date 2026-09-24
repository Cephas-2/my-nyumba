import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { APP_CONFIG } from '@/constants/config';
import { colors, spacing } from '@/constants/theme';
import { AppText } from '@/components/ui/AppText';
import { Logo } from '@/components/ui/Logo';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => router.replace('/welcome'), 1800);
    return () => clearTimeout(timer);
  }, [opacity, scale, router]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center', gap: spacing.md }}>
        <Logo size={56} inverse />
        <AppText color="#CFE5DE" align="center">{APP_CONFIG.tagline}</AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', padding: spacing.xl } });

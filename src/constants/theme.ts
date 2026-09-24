import { Platform, type TextStyle, type ViewStyle } from 'react-native';

// Single source of truth for the My Nyumba look and feel.
export const colors = {
  primary: '#0F5C4D',
  primaryPressed: '#0A4A3E',
  primarySoft: '#E4F1ED',
  accent: '#D9A441',
  accentSoft: '#FBF1DC',
  background: '#F5F6F4',
  surface: '#FFFFFF',
  border: '#E1E5E2',
  text: '#14201C',
  textMuted: '#55635D',
  textOnPrimary: '#FFFFFF',
  success: '#17754A',
  successSoft: '#E1F3EA',
  warning: '#8A5A0B',
  warningSoft: '#FBEFD5',
  danger: '#B3261E',
  dangerSoft: '#FBE4E1',
  info: '#245A9E',
  infoSoft: '#E3EEF9',
  neutral: '#4A5752',
  neutralSoft: '#ECEFED',
  overlay: 'rgba(12, 22, 18, 0.5)',
} as const;

export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const toneColors: Record<Tone, { fg: string; bg: string }> = {
  primary: { fg: colors.primary, bg: colors.primarySoft },
  success: { fg: colors.success, bg: colors.successSoft },
  warning: { fg: colors.warning, bg: colors.warningSoft },
  danger: { fg: colors.danger, bg: colors.dangerSoft },
  info: { fg: colors.info, bg: colors.infoSoft },
  neutral: { fg: colors.neutral, bg: colors.neutralSoft },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;
export const layout = { minTouchTarget: 48, screenPadding: 16 } as const;

export type TextVariant =
  | 'display' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'label' | 'caption' | 'overline';

export const typography: Record<TextVariant, TextStyle> = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  heading: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '400' },
  overline: { fontSize: 11, lineHeight: 16, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
};

export const shadows: { card: ViewStyle } = {
  card:
    Platform.select<ViewStyle>({
      ios: { shadowColor: '#0B1A15', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
      default: {},
    }) ?? {},
};

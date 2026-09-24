import { Text, type TextProps } from 'react-native';
import { colors, typography, type TextVariant } from '@/constants/theme';

interface Props extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function AppText({ variant = 'body', color = colors.text, align, style, ...rest }: Props) {
  return (
    <Text
      maxFontSizeMultiplier={1.4}
      {...rest}
      style={[typography[variant], { color }, align ? { textAlign: align } : null, style]}
    />
  );
}

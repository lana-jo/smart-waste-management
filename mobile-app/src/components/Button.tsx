import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  accessibilityLabel,
  fullWidth = true,
}: Props) {
  const { colors, radii, spacing, typography, shadow } = useTheme();
  const inactive = disabled || loading;

  const height = size === 'sm' ? 44 : size === 'lg' ? 56 : 48;
  const padH = size === 'sm' ? spacing.md : spacing.lg;

  const bg =
    variant === 'primary' ? colors.primary :
    variant === 'danger' ? colors.danger :
    variant === 'secondary' ? colors.surface :
    'transparent';
  const fg =
    variant === 'primary' || variant === 'danger' ? colors.primaryText :
    variant === 'secondary' ? colors.textPrimary :
    colors.primary;
  const border = variant === 'secondary' ? colors.border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          paddingHorizontal: padH,
          borderRadius: radii.md,
          backgroundColor: bg,
          borderColor: border,
          opacity: inactive ? 0.5 : 1,
          transform: [{ scale: pressed && !inactive ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        variant === 'primary' && !inactive ? shadow(3) : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[typography.button, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  children: React.ReactNode;
  padding?: number;
  style?: object;
}

export default function Card({ children, padding, style }: Props) {
  const { colors, radii, spacing, shadow } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.card,
          borderColor: colors.borderLight,
          borderRadius: radii.lg,
          padding: padding ?? spacing.lg,
        },
        shadow(2),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1 },
});
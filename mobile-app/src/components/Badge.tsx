import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface Props {
  label: string;
  tone?: Tone;
}

export default function Badge({ label, tone = 'neutral' }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const map = {
    primary: { bg: colors.badgeBg, fg: colors.badgeText, border: colors.badgeBorder },
    success: { bg: colors.badgeBg, fg: colors.badgeText, border: colors.badgeBorder },
    warning: { bg: colors.surface, fg: colors.warning, border: colors.border },
    danger: { bg: colors.dangerBg, fg: colors.danger, border: colors.danger },
    neutral: { bg: colors.tabBg, fg: colors.textSecondary, border: colors.border },
  }[tone];

  return (
    <View style={[styles.base, { backgroundColor: map.bg, borderColor: map.border, borderRadius: radii.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs }]}>
      <Text style={[typography.captionBold, { color: map.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignSelf: 'flex-start' },
});
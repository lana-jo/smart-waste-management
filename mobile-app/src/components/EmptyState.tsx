import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionLabel, onAction }: Props) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: colors.tabBg }]} />
      <Text style={[typography.subtitle, { color: colors.textPrimary, marginTop: spacing.lg, textAlign: 'center' }]}>{title}</Text>
      {description ? (
        <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }]}>{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Text style={[typography.captionBold, { color: colors.primary, marginTop: spacing.lg, paddingVertical: 8 }]} onPress={onAction} accessibilityRole="button" accessibilityLabel={actionLabel}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  dot: { width: 56, height: 56, borderRadius: 28 },
});
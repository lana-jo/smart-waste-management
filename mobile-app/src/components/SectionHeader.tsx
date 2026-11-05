import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, right }: Props) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={[styles.row, { marginBottom: spacing.md }]}>
      <View style={{ flex: 1 }}>
        <Text style={[typography.title, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs }]}>{subtitle}</Text> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
});
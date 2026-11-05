import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ReportItem } from '../types';
import { useTheme } from '../theme';
import Badge from './Badge';

interface Props {
  item: ReportItem;
}

export default function ReportCard({ item }: Props) {
  const { colors, radii, spacing, typography, shadow } = useTheme();
  const statusTone =
    item.status.toLowerCase().includes('selesai') ? 'success' :
    item.status.toLowerCase().includes('tolak') ? 'danger' :
    'primary';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight, borderRadius: radii.md, padding: spacing.md }, shadow(1)]}>
      <View style={styles.row}>
        <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>{item.category}</Text>
        <Badge label={item.status} tone={statusTone} />
      </View>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs }]} numberOfLines={2}>
        {item.description || 'Tanpa deskripsi tambahan.'}
      </Text>
      <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
        {new Date(item.created_at).toLocaleString('id-ID')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
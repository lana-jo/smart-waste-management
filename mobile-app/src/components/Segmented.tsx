import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Tab { key: string; label: string; count?: number }

interface Props {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function Segmented({ tabs, activeKey, onChange }: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.tabBg, borderRadius: radii.md, padding: spacing.xs }]}>
      {tabs.map((t) => {
        const active = t.key === activeKey;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && { backgroundColor: colors.tabActiveBg, borderRadius: radii.sm }]}
          >
            <Text style={[typography.captionBold, { color: active ? colors.textPrimary : colors.textSecondary }]}>
              {t.label}{typeof t.count === 'number' ? ` (${t.count})` : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6, minHeight: 44 },
});
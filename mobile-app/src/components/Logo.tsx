import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  size?: number;
}

export default function Logo({ size = 64 }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.25, backgroundColor: '#16a34a' }]}>
      <Text style={[styles.symbol, { fontSize: size * 0.45, color: '#ffffff' }]}>♻</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  innerCircle: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontWeight: 'bold',
  },
});

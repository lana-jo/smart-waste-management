import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  size?: number;
}

export default function Logo({ size = 64 }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: colors.primary }]}>
      <View style={[styles.innerCircle, { width: size * 0.65, height: size * 0.65, borderRadius: size * 0.325 }]}>
        <Text style={[styles.symbol, { fontSize: size * 0.38, color: colors.primary }]}>♻</Text>
      </View>
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

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string | null;
  multiline?: boolean;
  accessibilityLabel?: string;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  multiline = false,
  accessibilityLabel,
}: Props) {
  const { colors, radii, spacing, typography } = useTheme();
  const hasError = !!error;

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <Text style={[typography.captionBold, { color: colors.textPrimary, marginBottom: spacing.xs }]}>{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        accessibilityLabel={accessibilityLabel || label || placeholder}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: hasError ? colors.danger : colors.border,
            color: colors.inputText,
            borderRadius: radii.md,
            minHeight: multiline ? 88 : 48,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {hasError ? (
        <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.xs }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
});
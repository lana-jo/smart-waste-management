import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { loginApi } from '../services/api';
import { useTheme } from '../theme';

interface Props {
  onLoginSuccess: (token: string) => void;
  onNavigateRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const token = await loginApi(email, password);
      onLoginSuccess(token);
    } catch (e: any) {
      Alert.alert('Login Gagal', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Smart Waste Login</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Masuk untuk mulai melaporkan sampah.</Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.inputText }]}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.inputText }]}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: colors.primary }]} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>Masuk</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={onNavigateRegister}>
        <Text style={[styles.linkText, { color: colors.primary }]}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 24 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  buttonPrimary: { paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  linkText: { fontWeight: '600', fontSize: 14 },
});

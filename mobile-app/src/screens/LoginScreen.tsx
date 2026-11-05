import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { loginApi } from '../services/api';
import { useTheme } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Logo from '../components/Logo';

interface Props {
  onLoginSuccess: (token: string) => void;
  onNavigateRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, spacing, typography, radii } = useTheme();

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const token = await loginApi(email, password);
      onLoginSuccess(token);
    } catch (e: any) {
      setError(e?.message || 'Login gagal. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { marginBottom: spacing.xxl }]}>
          <Logo size={72} />
          <Text style={[typography.display, { color: colors.textPrimary, marginTop: spacing.lg }]}>Smart Waste</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }]}>
            Laporkan sampah di sekitar Anda. Masuk untuk mulai berkontribusi.
          </Text>
        </View>

        <Card>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error && !email.trim() ? error : null}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            autoCapitalize="none"
            error={error && !password ? error : null}
          />
          {error && email.trim() && password ? (
            <Text style={[typography.caption, { color: colors.danger, marginBottom: spacing.md }]}>{error}</Text>
          ) : null}
          <Button label="Masuk" onPress={handleLogin} loading={loading} />
        </Card>

        <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Belum punya akun?</Text>
          <Text style={[typography.bodyBold, { color: colors.primary, marginTop: spacing.xs, paddingVertical: 8 }]} onPress={onNavigateRegister} accessibilityRole="button" accessibilityLabel="Buka halaman daftar">
            Daftar sekarang
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  hero: { alignItems: 'center' },
  logo: { width: 64, height: 64 },
});

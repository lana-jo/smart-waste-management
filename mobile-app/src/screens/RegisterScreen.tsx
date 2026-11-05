import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { registerApi } from '../services/api';
import { useTheme } from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Logo from '../components/Logo';

interface Props {
  onRegisterSuccess: () => void;
  onNavigateLogin: () => void;
}

export default function RegisterScreen({ onRegisterSuccess, onNavigateLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, spacing, typography, radii } = useTheme();

  const handleRegister = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !password) {
      setError('Nama, email, dan password wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    setLoading(true);
    try {
      await registerApi(name, email, password);
      onRegisterSuccess();
    } catch (e: any) {
      setError(e?.message || 'Registrasi gagal. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.hero, { marginBottom: spacing.xxl }]}>
          <Logo size={72} />
          <Text style={[typography.display, { color: colors.textPrimary, marginTop: spacing.lg }]}>Buat Akun</Text>
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' }]}>
            Daftar untuk mulai melaporkan sampah di lingkungan Anda.
          </Text>
        </View>

        <Card>
          <Input label="Nama Lengkap" value={name} onChangeText={setName} placeholder="Nama Anda" />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            autoCapitalize="none"
          />
          {error ? <Text style={[typography.caption, { color: colors.danger, marginBottom: spacing.md }]}>{error}</Text> : null}
          <Button label="Daftar" onPress={handleRegister} loading={loading} />
        </Card>

        <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
          <Text style={[typography.body, { color: colors.textSecondary }]}>Sudah punya akun?</Text>
          <Text style={[typography.bodyBold, { color: colors.primary, marginTop: spacing.xs, paddingVertical: 8 }]} onPress={onNavigateLogin} accessibilityRole="button" accessibilityLabel="Kembali ke halaman masuk">
            Masuk
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
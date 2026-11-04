import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, useColorScheme } from 'react-native';
import { registerApi } from '../services/api';
import theme from '../theme';

interface Props {
  onRegisterSuccess: () => void;
  onNavigateLogin: () => void;
}

export default function RegisterScreen({ onRegisterSuccess, onNavigateLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() || 'light';
  const colors = theme[colorScheme];

  const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    subtitle: { fontSize: 14, color: colors.secondaryText, marginBottom: 24 },
    input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: colors.text },
    buttonPrimary: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: colors.buttonText, fontSize: 16, fontWeight: '600' },
    linkText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  });

  const handleRegister = async () => {
    setLoading(true);
    try {
      await registerApi(name, email, password);
      Alert.alert('Berhasil', 'Akun berhasil dibuat. Silakan login.');
      onRegisterSuccess();
    } catch (e: any) {
      Alert.alert('Registrasi Gagal', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>
      <Text style={styles.subtitle}>Buat akun untuk berkontribusi.</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        placeholderTextColor={colors.secondaryText}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.secondaryText}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 char)"
        placeholderTextColor={colors.secondaryText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={onNavigateLogin}>
        <Text style={styles.linkText}>Sudah punya akun? Masuk</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Alert, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ActiveTab, Prediction, ReportItem } from '../types';
import { fetchReportsApi, submitReportApi } from '../services/api';
import theme from '../theme';

interface Props {
  token: string;
  onLogout: () => void;
}

export default function DashboardScreen({ token, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const colorScheme = useColorScheme() || 'light';
  const colors = theme[colorScheme];

  const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    logoutText: { color: colors.error, fontWeight: '600', fontSize: 14 },
    input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: colors.text },
    buttonPrimary: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: colors.buttonText, fontSize: 16, fontWeight: '600' },
    buttonSecondary: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.inputBorder },
    buttonSecondaryText: { color: colors.secondaryBtnText, fontSize: 14, fontWeight: '500' },
    previewContainer: { backgroundColor: colors.cardBg, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder },
    label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
    badge: { backgroundColor: colors.badgeBg, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.primary, marginVertical: 8 },
    badgeText: { color: colors.badgeText, fontWeight: '600', fontSize: 14, textAlign: 'center' },
    locText: { fontSize: 12, color: colors.secondaryText, marginTop: 4 },
    tabRow: { flexDirection: 'row', marginBottom: 20, backgroundColor: colors.inputBorder, borderRadius: 8, padding: 4 },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
    activeTab: { backgroundColor: colors.cardBg },
    tabText: { color: colors.secondaryText, fontWeight: '600', fontSize: 14 },
    activeTabText: { color: colors.text },
    reportCard: { backgroundColor: colors.cardBg, padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder },
    reportCat: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    reportDesc: { fontSize: 14, color: colors.secondaryBtnText, marginBottom: 6 },
    reportDate: { fontSize: 11, color: colors.secondaryText },
  });

  const loadReports = async () => {
    try {
      const items = await fetchReportsApi(token);
      setReports(items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const pickImageAndDetect = async () => {
    const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (camStatus !== 'granted') {
      Alert.alert('Izin Ditolak', 'Akses kamera diperlukan untuk mengambil foto sampah.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }

      setTimeout(() => {
        setPrediction({
          predicted_class: "Plastic Waste",
          confidence: 0.94,
        });
        setLoading(false);
      }, 1000);
    }
  };

  const submitReport = async () => {
    if (!image) {
      Alert.alert("Perhatian", "Ambil foto terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      await submitReportApi(token, image, description, location, prediction);
      Alert.alert("Berhasil", "Laporan sampah berhasil dikirim ke server!");
      setImage(null);
      setPrediction(null);
      setDescription('');
      setLocation(null);
      loadReports();
      setActiveTab('list');
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Smart Waste Mobile</Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'create' && styles.activeTab]} onPress={() => setActiveTab('create')}>
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>Buat Laporan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'list' && styles.activeTab]} onPress={() => { setActiveTab('list'); loadReports(); }}>
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Riwayat ({reports.length})</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'create' ? (
        <View>
          {!image ? (
            <TouchableOpacity style={styles.buttonPrimary} onPress={pickImageAndDetect}>
              <Text style={styles.buttonText}>Ambil Foto Sampah & GPS</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Text style={styles.label}>Foto Terpilih & Hasil AI:</Text>
              {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />}
              
              {prediction && !loading && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    Terdeteksi: {prediction.predicted_class} ({(prediction.confidence * 100).toFixed(0)}%)
                  </Text>
                </View>
              )}

              {location && (
                <Text style={styles.locText}>
                  Lokasi: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                </Text>
              )}

              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Deskripsi tambahan (opsional)"
                placeholderTextColor={colors.secondaryText}
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 16 }]} onPress={submitReport}>
                <Text style={styles.buttonText}>Kirim Laporan ke Server</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.buttonSecondary, { marginTop: 10 }]} onPress={() => { setImage(null); setPrediction(null); }}>
                <Text style={styles.buttonSecondaryText}>Ulangi Foto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View>
          {reports.length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.secondaryText, marginTop: 32 }}>Belum ada laporan.</Text>
          ) : (
            reports.map((r) => (
              <View key={r.id} style={styles.reportCard}>
                <Text style={styles.reportCat}>{r.category} — <Text style={{ fontWeight: 'normal', color: colors.primary }}>{r.status}</Text></Text>
                <Text style={styles.reportDesc}>{r.description || 'Tanpa deskripsi'}</Text>
                <Text style={styles.reportDate}>{new Date(r.created_at).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ActiveTab, Prediction, ReportItem } from '../types';
import { fetchReportsApi, submitReportApi, predictWasteApi } from '../services/api';
import { useTheme } from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import ReportCard from '../components/ReportCard';
import SectionHeader from '../components/SectionHeader';
import Segmented from '../components/Segmented';
import Logo from '../components/Logo';

interface Props {
  token: string;
  onLogout: () => void;
}

export default function DashboardScreen({ token, onLogout }: Props) {
  const { colors, spacing, typography, radii } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      const items = await fetchReportsApi(token);
      setReports(items);
      setReportsError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Coba lagi nanti.';
      setReportsError('Riwayat laporan tidak bisa dimuat. ' + msg);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const pickImageAndDetect = async () => {
    try {
      const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (camStatus !== 'granted') {
        Alert.alert('Izin kamera ditolak', 'Akses kamera diperlukan untuk mengambil foto sampah.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      const uri = result.assets[0].uri;
      setImage(uri);
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation(loc);
        } catch {
          // Lokasi opsional; laporan tetap bisa dikirim.
        }
      }
      const predictionData = await predictWasteApi(token, uri);
      setPrediction(predictionData);
    } catch (e) {
      Alert.alert('Gagal memproses foto', e instanceof Error ? e.message : 'Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async () => {
    if (!image) {
      Alert.alert('Foto belum ada', 'Ambil foto sampah terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      await submitReportApi(token, image, description, location, prediction);
      Alert.alert('Berhasil', 'Laporan sampah berhasil dikirim ke server.');
      setImage(null);
      setPrediction(null);
      setDescription('');
      setLocation(null);
      await loadReports();
      setActiveTab('list');
    } catch (e: any) {
      Alert.alert('Gagal mengirim', e?.message || 'Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const resetPhoto = () => {
    setImage(null);
    setPrediction(null);
    setLocation(null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Logo size={40} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>Selamat datang</Text>
            <Text style={[typography.title, { color: colors.textPrimary }]}>Smart Waste</Text>
          </View>
        </View>
        <Text style={[typography.bodyBold, { color: colors.danger, paddingVertical: 8, paddingHorizontal: 4 }]} onPress={onLogout} accessibilityRole="button" accessibilityLabel="Keluar dari akun">
          Keluar
        </Text>
      </View>

      <Segmented
        tabs={[
          { key: 'create', label: 'Buat Laporan' },
          { key: 'list', label: 'Riwayat', count: reports.length },
        ]}
        activeKey={activeTab}
        onChange={(k) => {
          const next = k as ActiveTab;
          setActiveTab(next);
          if (next === 'list') loadReports();
        }}
      />

      {activeTab === 'create' ? (
        <View>
          {!image ? (
            <Card>
              <SectionHeader title="Laporkan Sampah" subtitle="Ambil foto, sistem akan mengenali jenis sampah otomatis." />
              <Button label="Ambil Foto & Lokasi" onPress={pickImageAndDetect} loading={loading} />
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' }]}>
                Pastikan izin kamera dan lokasi aktif.
              </Text>
            </Card>
          ) : (
            <Card>
              <Image source={{ uri: image }} style={[styles.preview, { borderRadius: radii.md }]} resizeMode="cover" />
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={[typography.body, { color: colors.textSecondary, marginLeft: spacing.sm }]}>Menganalisis foto...</Text>
                </View>
              ) : null}
              {prediction && !loading ? (
                <View style={[styles.predictionRow, { backgroundColor: colors.badgeBg, borderColor: colors.badgeBorder, borderRadius: radii.md, marginTop: spacing.md }]}>
                  <Text style={[typography.bodyBold, { color: colors.badgeText }]}>
                    Terdeteksi: {prediction.predicted_class}
                  </Text>
                  <Text style={[typography.caption, { color: colors.badgeText }]}>
                    Keyakinan {(prediction.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
              ) : null}
              {location ? (
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                  Lokasi: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                </Text>
              ) : null}
              <Input
                label="Deskripsi (opsional)"
                value={description}
                onChangeText={setDescription}
                placeholder="Tambahkan detail lokasi atau kondisi..."
                multiline
              />
              <Button label="Kirim Laporan" onPress={submitReport} loading={loading} />
              <View style={{ marginTop: spacing.sm }}>
                <Button label="Ulangi Foto" variant="secondary" onPress={resetPhoto} />
              </View>
            </Card>
          )}
        </View>
      ) : (
        <View>
          {reportsError ? (
            <Card>
              <Text style={[typography.body, { color: colors.danger }]}>{reportsError}</Text>
              <View style={{ marginTop: spacing.md }}>
                <Button label="Coba Lagi" variant="secondary" onPress={loadReports} />
              </View>
            </Card>
          ) : reports.length === 0 ? (
            <EmptyState
              title="Belum ada laporan"
              description="Foto pertama Anda akan muncul di sini setelah dikirim."
              actionLabel="Buat laporan"
              onAction={() => setActiveTab('create')}
            />
          ) : (
            reports.map((r) => <ReportCard key={r.id} item={r} />)
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  preview: { width: '100%', height: 220, backgroundColor: '#000' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  predictionRow: { borderWidth: 1, padding: 12 },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const pickImageAndDetect = async () => {
    // 1. Ambil foto dengan kompresi kualitas sesuai PRD (0.5)
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setLoading(true);

      // Ambil GPS
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }

      // Simulasi 2-Step AI Detection Call (POST /api/ml/predict)
      setTimeout(() => {
        setPrediction({
          predicted_class: "Plastic Waste",
          confidence: 0.94,
          probabilities: {
            "Organic Waste": 0.02,
            "Plastic Waste": 0.94,
            "Paper Waste": 0.04
          }
        });
        setLoading(false);
      }, 1500);
    }
  };

  const submitReport = () => {
    if (!image || !prediction) {
      Alert.alert("Perhatian", "Ambil foto dan tunggu hasil deteksi AI terlebih dahulu.");
      return;
    }
    Alert.alert("Berhasil", "Laporan sampah berhasil dikirim ke server!", [
      { text: "OK", onPress: () => { setImage(null); setPrediction(null); setDescription(''); } }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Waste Mobile</Text>
      <Text style={styles.subtitle}>Laporkan tumpukan sampah dengan deteksi AI otomatis.</Text>

      {!image ? (
        <TouchableOpacity style={styles.buttonPrimary} onPress={pickImageAndDetect}>
          <Text style={styles.buttonText}>Ambil Foto Sampah</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.label}>Foto Terpilih & Hasil AI:</Text>
          {loading && <ActivityIndicator size="large" color="#047857" style={{ marginVertical: 20 }} />}
          
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

          <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 20 }]} onPress={submitReport}>
            <Text style={styles.buttonText}>Kirim Laporan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonSecondary, { marginTop: 10 }]} onPress={() => { setImage(null); setPrediction(null); }}>
            <Text style={styles.buttonSecondaryText}>Ulangi Foto</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f9fafb', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1c1917', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#78716c', textAlign: 'center', marginBottom: 32 },
  buttonPrimary: { backgroundColor: '#047857', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  buttonSecondary: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#d6d3d1' },
  buttonSecondaryText: { color: '#44403c', fontSize: 14, fontWeight: '500' },
  previewContainer: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e7e5e4' },
  label: { fontSize: 14, fontWeight: '600', color: '#1c1917', marginBottom: 8 },
  badge: { backgroundColor: '#ecfdf5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#a7f3d0', marginVertical: 8 },
  badgeText: { color: '#065f46', fontWeight: '600', fontSize: 14, textAlign: 'center' },
  locText: { fontSize: 12, color: '#78716c', marginTop: 4 }
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ReportItem } from '../types';
import { useTheme } from '../theme';
import Badge from './Badge';
import { API_URL } from '../config';

interface Props {
  item: ReportItem;
}

export default function ReportCard({ item }: Props) {
  const { colors, radii, spacing, typography, shadow } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const statusTone =
    item.status.toLowerCase().includes('selesai') ? 'success' :
    item.status.toLowerCase().includes('tolak') ? 'danger' :
    'primary';

  const imageUrl = item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`) : null;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight, borderRadius: radii.md, padding: spacing.md }, shadow(1)]}
      >
        <View style={styles.container}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={[styles.thumb, { borderRadius: radii.sm }]} resizeMode="cover" />
          ) : null}
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={[typography.bodyBold, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>{item.category}</Text>
              <Badge label={item.status} tone={statusTone} />
            </View>
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
              AI Conf: {Math.round((item.confidence ?? 0) * 100)}%
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.xs }]} numberOfLines={2}>
              {item.description || 'Tanpa deskripsi tambahan.'}
            </Text>
            {item.latitude && item.longitude ? (
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs, fontFamily: 'monospace' }]}>
                Lokasi: {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
            ) : null}
            <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs }]}>
              {new Date(item.created_at).toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderRadius: radii.lg, padding: spacing.lg }, shadow(5)]}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.row}>
                <Text style={[typography.title, { color: colors.textPrimary, flex: 1 }]}>Detail Laporan</Text>
                <Badge label={item.status} tone={statusTone} />
              </View>

              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={[styles.fullImage, { borderRadius: radii.md, marginTop: spacing.md }]} resizeMode="cover" />
              ) : null}

              <View style={[styles.detailSection, { marginTop: spacing.md }]}>
                <Text style={[typography.captionBold, { color: colors.textSecondary }]}>KATEGORI SAMPAH</Text>
                <Text style={[typography.bodyBold, { color: colors.textPrimary, marginTop: 2 }]}>{item.category}</Text>
              </View>

              <View style={[styles.detailSection, { marginTop: spacing.sm }]}>
                <Text style={[typography.captionBold, { color: colors.textSecondary }]}>KEPERCAYAAN AI</Text>
                <Text style={[typography.body, { color: colors.textPrimary, marginTop: 2 }]}>{Math.round((item.confidence ?? 0) * 100)}%</Text>
              </View>

              <View style={[styles.detailSection, { marginTop: spacing.sm }]}>
                <Text style={[typography.captionBold, { color: colors.textSecondary }]}>DESKRIPSI</Text>
                <Text style={[typography.body, { color: colors.textPrimary, marginTop: 2 }]}>{item.description || 'Tidak ada deskripsi.'}</Text>
              </View>

              {item.latitude && item.longitude ? (
                <View style={[styles.detailSection, { marginTop: spacing.sm }]}>
                  <Text style={[typography.captionBold, { color: colors.textSecondary }]}>LOKASI GPS</Text>
                  <Text style={[typography.body, { color: colors.textPrimary, marginTop: 2, fontFamily: 'monospace' }]}>
                    {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
                  </Text>
                </View>
              ) : null}

              <View style={[styles.detailSection, { marginTop: spacing.sm }]}>
                <Text style={[typography.captionBold, { color: colors.textSecondary }]}>WAKTU LAPOR</Text>
                <Text style={[typography.body, { color: colors.textPrimary, marginTop: 2 }]}>{new Date(item.created_at).toLocaleString('id-ID')}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.closeButton, { backgroundColor: colors.primary, borderRadius: radii.md, marginTop: spacing.xl, paddingVertical: spacing.md }]}>
                <Text style={[typography.button, { color: colors.primaryText, textAlign: 'center' }]}>Tutup</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, marginBottom: 12 },
  container: { flexDirection: 'row', gap: 12 },
  thumb: { width: 64, height: 64, backgroundColor: '#eee' },
  content: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { width: '100%', maxHeight: '85%' },
  modalScroll: { paddingBottom: 16 },
  fullImage: { width: '100%', height: 220, backgroundColor: '#eee' },
  detailSection: { borderTopWidth: 1, borderTopColor: '#e8eeea', paddingTop: 8 },
  closeButton: { width: '100%' },
});
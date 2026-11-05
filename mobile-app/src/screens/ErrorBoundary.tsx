import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  /** Dipanggil Rear screen direset, mis. kembali ke layar login. */
  onResetExit?: () => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  resetCount: number;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 14, marginTop: 8, marginBottom: 24, textAlign: 'center' },
  button: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, alignItems: 'center' },
});

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, resetCount: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReload={this.handleReset} onResetExit={this.props.onResetExit} />;
    }
    // key resetCount memaksa subtree diremount ulang saat Muat Ulang,
    // bukan hanya render ulang dengan state yang sama rusak.
    return <React.Fragment key={this.state.resetCount}>{this.props.children}</React.Fragment>;
  }

  private handleReset = () => {
    this.setState((s) => ({ hasError: false, resetCount: s.resetCount + 1 }));
  };
}

function ErrorFallback({ onReload, onResetExit }: { onReload: () => void; onResetExit?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Layar tiba-tiba berhenti</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Tampilan mengalami gangguan, perubahan terakhir belum tersimpan. Muat ulang untuk melanjutkan.
      </Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onReload} accessibilityRole="button" accessibilityLabel="Muat ulang layar">
        <Text style={{ color: colors.primaryText, fontWeight: '600' }}>Muat Ulang</Text>
      </TouchableOpacity>
      {onResetExit ? (
        <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }} onPress={onResetExit} accessibilityRole="button" accessibilityLabel="Kembali ke layar login">
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Kembali ke Login</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

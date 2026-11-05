import React, { useState } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthMode } from './src/types';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ErrorBoundary from './src/screens/ErrorBoundary';

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [token, setToken] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const logout = () => {
    setToken(null);
    setAuthMode('login');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ErrorBoundary onResetExit={logout} key={authMode}>
      {authMode === 'login' && (
        <LoginScreen
          onLoginSuccess={(t) => {
            setToken(t);
            setAuthMode('app');
          }}
          onNavigateRegister={() => setAuthMode('register')}
        />
      )}
      {authMode === 'register' && (
        <RegisterScreen
          onRegisterSuccess={() => setAuthMode('login')}
          onNavigateLogin={() => setAuthMode('login')}
        />
      )}
      {authMode === 'app' && (
        <DashboardScreen
          token={token || ''}
          onLogout={logout}
        />
      )}
      </ErrorBoundary>
    </SafeAreaView>
  );
}

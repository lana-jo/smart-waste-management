import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthMode } from './src/types';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [token, setToken] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
          onLogout={() => {
            setToken(null);
            setAuthMode('login');
          }}
        />
      )}
    </>
  );
}

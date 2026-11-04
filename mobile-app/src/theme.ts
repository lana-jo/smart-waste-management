import { useColorScheme } from 'react-native';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: {
      background: isDark ? '#09090b' : '#f9fafb', // zinc-950 / gray-50
      surface: isDark ? '#18181b' : '#ffffff',    // zinc-900 / white
      card: isDark ? '#18181b' : '#ffffff',
      textPrimary: isDark ? '#f4f4f5' : '#1c1917',  // zinc-100 / stone-900
      textSecondary: isDark ? '#a1a1aa' : '#78716c', // zinc-400 / stone-500
      border: isDark ? '#27272a' : '#d6d3d1',     // zinc-800 / stone-300
      borderLight: isDark ? '#27272a' : '#e7e5e4',
      primary: isDark ? '#10b981' : '#047857',    // emerald-500 / emerald-700
      primaryText: '#ffffff',
      danger: isDark ? '#f87171' : '#dc2626',
      badgeBg: isDark ? '#064e3b' : '#ecfdf5',    // emerald-900 / emerald-50
      badgeBorder: isDark ? '#047857' : '#a7f3d0',
      badgeText: isDark ? '#6ee7b7' : '#065f46',    // emerald-300 / emerald-800
      tabBg: isDark ? '#27272a' : '#e7e5e4',
      tabActiveBg: isDark ? '#18181b' : '#ffffff',
      inputBg: isDark ? '#18181b' : '#ffffff',
      inputText: isDark ? '#f4f4f5' : '#1c1917',
      placeholder: isDark ? '#71717a' : '#78716c',
    }
  };
}

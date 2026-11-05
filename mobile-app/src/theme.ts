import { Platform, useColorScheme } from 'react-native';

// Design tokens: spacing, radii, typography, shadow.
// Brand: emerald (lingkungan). Material Design 3 influence.
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };
export const radii = { xs: 6, sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const typography = {
  display: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  title: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  subtitle: { fontSize: 16, fontWeight: '500' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
};

export const shadow = (elevation = 2) =>
  Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: elevation }, shadowOpacity: 0.08, shadowRadius: elevation * 2 },
    android: { elevation },
    default: {},
  });

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const colors = isDark
    ? {
        background: '#0c0f0d',
        surface: '#151a17',
        card: '#151a17',
        textPrimary: '#e8f0ea',
        textSecondary: '#9aa8a0',
        border: '#242c27',
        borderLight: '#1e2520',
        primary: '#10b981',
        primaryPressed: '#059669',
        primaryText: '#052e16',
        danger: '#f87171',
        dangerBg: '#3f1a1a',
        badgeBg: '#064e3b',
        badgeBorder: '#047857',
        badgeText: '#6ee7b7',
        tabBg: '#1e2520',
        tabActiveBg: '#151a17',
        inputBg: '#151a17',
        inputText: '#e8f0ea',
        placeholder: '#6b7a72',
        success: '#34d399',
        warning: '#fbbf24',
        info: '#60a5fa',
        overlay: 'rgba(0,0,0,0.5)',
      }
    : {
        background: '#f4f7f5',
        surface: '#ffffff',
        card: '#ffffff',
        textPrimary: '#1a2e1f',
        textSecondary: '#5b6b61',
        border: '#dce3de',
        borderLight: '#e8eeea',
        primary: '#047857',
        primaryPressed: '#065f46',
        primaryText: '#ffffff',
        danger: '#dc2626',
        dangerBg: '#fee2e2',
        badgeBg: '#ecfdf5',
        badgeBorder: '#a7f3d0',
        badgeText: '#065f46',
        tabBg: '#e8eeea',
        tabActiveBg: '#ffffff',
        inputBg: '#ffffff',
        inputText: '#1a2e1f',
        placeholder: '#8a9a90',
        success: '#059669',
        warning: '#d97706',
        info: '#2563eb',
        overlay: 'rgba(0,0,0,0.4)',
      };

  return { isDark, colors, spacing, radii, typography, shadow };
}
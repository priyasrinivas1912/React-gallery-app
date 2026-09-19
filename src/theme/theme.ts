export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  danger: string;
  dangerSurface: string;
  success: string;
  successSurface: string;
  cardBg: string;
  tabBarBg: string;
  tabBarBorder: string;
}

export const lightTheme: ThemeColors = {
  primary: '#3B82F6', // Modern vibrant blue
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  accent: '#F59E0B',
  danger: '#EF4444',
  dangerSurface: '#FEF2F2',
  success: '#10B981',
  successSurface: '#ECFDF5',
  cardBg: '#FFFFFF',
  tabBarBg: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
};

export const darkTheme: ThemeColors = {
  primary: '#60A5FA',
  primaryDark: '#3B82F6',
  primaryLight: '#1E293B',
  background: '#0B0F19',
  surface: '#131B2E',
  surfaceSubtle: '#1E293B',
  border: '#27354F',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#FBBF24',
  danger: '#F87171',
  dangerSurface: '#301818',
  success: '#34D399',
  successSurface: '#122E23',
  cardBg: '#131B2E',
  tabBarBg: '#0F172A',
  tabBarBorder: '#1E293B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

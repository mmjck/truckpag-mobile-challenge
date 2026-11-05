/**
 * Color palette for the Dictionary App
 * All colors used in the app should be defined here
 */

export const palette = {
  // Primary colors
  blue: '#007AFF',
  blueLight: '#5AC8FA',
  blueDark: '#0056CC',

  // Grays
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F2F2F7',
  gray200: '#E5E5EA',
  gray300: '#D1D1D6',
  gray400: '#C7C7CC',
  gray500: '#8E8E93',
  gray600: '#636366',
  gray700: '#48484A',
  gray800: '#3A3A3C',
  gray900: '#2C2C2E',
  black: '#000000',

  // Semantic colors
  red: '#FF3B30',
  orange: '#FF9500',
  yellow: '#FFCC00',
  green: '#34C759',
  teal: '#5AC8FA',
  purple: '#AF52DE',
  pink: '#FF2D55',

  // Transparent
  transparent: 'transparent',
} as const;

/**
 * Light theme colors
 */
export const lightColors = {
  // Backgrounds
  background: palette.gray100,
  backgroundSecondary: palette.white,
  backgroundTertiary: palette.gray200,

  // Text
  text: palette.black,
  textSecondary: palette.gray600,
  textTertiary: palette.gray500,
  textInverse: palette.white,

  // UI Elements
  primary: palette.blue,
  primaryPressed: palette.blueDark,
  border: palette.gray300,
  separator: palette.gray200,
  icon: palette.gray500,
  iconActive: palette.blue,

  // Interactive
  buttonBackground: palette.blue,
  buttonText: palette.white,
  buttonDisabled: palette.gray400,
  inputBackground: palette.white,
  inputBorder: palette.gray300,
  inputPlaceholder: palette.gray500,

  // Semantic
  error: palette.red,
  success: palette.green,
  warning: palette.orange,

  // Cards
  card: palette.white,
  cardBorder: palette.gray200,

  // Tab bar
  tabBar: palette.white,
  tabBarBorder: palette.gray300,
  tabIconDefault: palette.gray500,
  tabIconSelected: palette.blue,
} as const;

/**
 * Dark theme colors
 */
export const darkColors = {
  // Backgrounds
  background: palette.black,
  backgroundSecondary: palette.gray900,
  backgroundTertiary: palette.gray800,

  // Text
  text: palette.white,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.black,

  // UI Elements
  primary: palette.blue,
  primaryPressed: palette.blueLight,
  border: palette.gray700,
  separator: palette.gray800,
  icon: palette.gray500,
  iconActive: palette.blue,

  // Interactive
  buttonBackground: palette.blue,
  buttonText: palette.white,
  buttonDisabled: palette.gray600,
  inputBackground: palette.gray900,
  inputBorder: palette.gray700,
  inputPlaceholder: palette.gray500,

  // Semantic
  error: palette.red,
  success: palette.green,
  warning: palette.orange,

  // Cards
  card: palette.gray900,
  cardBorder: palette.gray800,

  // Tab bar
  tabBar: palette.gray900,
  tabBarBorder: palette.gray800,
  tabIconDefault: palette.gray500,
  tabIconSelected: palette.blue,
} as const;

export type ThemeColors = typeof lightColors;

/**
 * Spacing and layout constants for the Dictionary App
 * All spacing values used in the app should be defined here
 */

/**
 * Base spacing unit (4px)
 */
const BASE = 4;

/**
 * Spacing scale
 */
export const spacing = {
  /** 0px */
  none: 0,
  /** 2px */
  '2xs': BASE * 0.5,
  /** 4px */
  xs: BASE,
  /** 8px */
  sm: BASE * 2,
  /** 12px */
  md: BASE * 3,
  /** 16px */
  base: BASE * 4,
  /** 20px */
  lg: BASE * 5,
  /** 24px */
  xl: BASE * 6,
  /** 32px */
  '2xl': BASE * 8,
  /** 40px */
  '3xl': BASE * 10,
  /** 48px */
  '4xl': BASE * 12,
  /** 64px */
  '5xl': BASE * 16,
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

/**
 * Border widths
 */
export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

/**
 * Common layout values
 */
export const layout = {
  /** Screen horizontal padding */
  screenPadding: spacing.base,
  /** Card padding */
  cardPadding: spacing.base,
  /** List item height */
  listItemHeight: 56,
  /** Button height */
  buttonHeight: 50,
  /** Input height */
  inputHeight: 50,
  /** Icon size - small */
  iconSm: 16,
  /** Icon size - medium */
  iconMd: 24,
  /** Icon size - large */
  iconLg: 32,
  /** Tab bar height */
  tabBarHeight: 49,
  /** Header height */
  headerHeight: 44,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Layout = typeof layout;

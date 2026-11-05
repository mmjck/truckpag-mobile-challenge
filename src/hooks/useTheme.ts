/**
 * Hook for accessing theme colors (light mode only)
 */
import { lightColors, ThemeColors } from '../theme/colors';

interface UseThemeReturn {
  colors: ThemeColors;
}

/**
 * Returns the light theme colors
 */
export function useTheme(): UseThemeReturn {
  return {
    colors: lightColors,
  };
}

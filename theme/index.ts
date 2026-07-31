import { configureFonts, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { lightColors, darkColors } from './colors';

const fontConfig = {
    fontFamily: 'System',
};

export const MoneyExLight = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: lightColors.accent,
        background: lightColors.bg,
        surface: lightColors.surface,
        onBackground: lightColors.textPrimary,
        onSurface: lightColors.textPrimary,
        outline: lightColors.border,
        error: lightColors.danger,
    },
    fonts: configureFonts({ config: fontConfig }),
};

export const MoneyExDark = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: darkColors.accent,
        background: darkColors.bg,
        surface: darkColors.surface,
        onBackground: darkColors.textPrimary,
        onSurface: darkColors.textPrimary,
        outline: darkColors.border,
        error: darkColors.danger,
    },
    fonts: configureFonts({ config: fontConfig }),
};

// ---------------------------------------------------------------------------
// Convenience hook to get app-specific color tokens anywhere.
// Usage: const colors = useAppColors();
// ---------------------------------------------------------------------------
import { useThemeMode } from '../context/ThemeContext';

export function useAppColors() {
    const { isDark } = useThemeMode();
    return isDark ? darkColors : lightColors;
}

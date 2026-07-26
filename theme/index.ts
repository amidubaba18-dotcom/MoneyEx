import { configureFonts, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const fontConfig = {
    fontFamily: 'System',
};

export const MoneyExLight = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#0F172A',
        secondary: '#2563EB',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        error: '#EF4444',
        onBackground: '#0F172A',
        onSurface: '#0F172A',
        outline: '#94A3B8',
    },
    fonts: configureFonts({ config: fontConfig }),
};

export const MoneyExDark = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#F1F5F9',
        secondary: '#60A5FA',
        background: '#0F172A',
        surface: '#1E293B',
        error: '#F87171',
        onBackground: '#F1F5F9',
        onSurface: '#F1F5F9',
        outline: '#64748B',
    },
    fonts: configureFonts({ config: fontConfig }),
};

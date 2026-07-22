import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

export const MoneyExLight = {
    ...MD3LightTheme,
    roundness: 16,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#5C6B7C',
        secondary: '#8A99A8',
        background: '#F4F6F8',
        surface: '#FFFFFF',
        surfaceVariant: '#E8EDF2',
        error: '#BE4B71',
        onPrimary: '#FFFFFF',
        onBackground: '#27313F',
        onSurface: '#27313F',
        outline: '#B8C2D1',
    },
};

export const MoneyExDark = {
    ...MD3DarkTheme,
    roundness: 16,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#7A8793',
        secondary: '#9AA4B0',
        background: '#111823',
        surface: '#17212D',
        surfaceVariant: '#1F2A38',
        error: '#C75A7B',
        onPrimary: '#FFFFFF',
        onBackground: '#E8ECEF',
        onSurface: '#E8ECEF',
        outline: '#5A6977',
    },
};
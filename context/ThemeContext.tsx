import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@moneyex_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');

    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
            console.log('📂 Loaded theme from storage:', saved);
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setModeState(saved);
            }
        });
    }, []);

    const setMode = (newMode: ThemeMode) => {
        console.log('🎨 Setting theme to:', newMode);
        setModeState(newMode);
        AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    };

    const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
    console.log('🌓 Current isDark:', isDark, 'mode:', mode, 'system:', systemScheme);

    return (
        <ThemeContext.Provider value={{ mode, isDark, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return context;
}

import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useThemeMode } from '../context/ThemeContext';
import { MoneyExLight, MoneyExDark } from '../theme';

function AppContent() {
    const { isDark } = useThemeMode();
    const theme = isDark ? MoneyExDark : MoneyExLight;

    return (
        <PaperProvider theme={theme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </PaperProvider>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

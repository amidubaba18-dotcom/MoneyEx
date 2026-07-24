import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useUIStore } from '../store/useUIStore';
import { MoneyExLight, MoneyExDark } from '../theme';
import { useEffect, useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    const isDarkMode = useUIStore((s) => s.isDarkMode);
    const theme = isDarkMode ? MoneyExDark : MoneyExLight;

    // Subscribe to database streams globally (for reactive balance/transactions)
    useEffect(() => {
        const unsub = useTransactionStore.getState().subscribe();
        return unsub;
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <StatusBar style={isDarkMode ? 'light' : 'dark'} />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="profile" options={{ presentation: 'modal', headerShown: false }} />
                    <Stack.Screen name="notifications" options={{ presentation: 'modal', headerShown: false }} />
                </Stack>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
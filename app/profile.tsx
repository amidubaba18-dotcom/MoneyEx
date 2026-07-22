import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import SettingsScreen from './(tabs)/settings';

export default function ProfileScreen() {
    const router = useRouter();

    const handleSwipe = ({ nativeEvent }: any) => {
        if (nativeEvent.translationX > 120 && Math.abs(nativeEvent.translationY) < 80) {
            router.push('/');
        }
    };

    return (
        <PanGestureHandler onEnded={handleSwipe} activeOffsetX={[-999, 10]} failOffsetY={[-80, 80]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                        <Text style={styles.backText}>{'←'}</Text>
                    </Pressable>
                    <Text style={styles.title}>Profile</Text>
                    <View style={styles.spacer} />
                </View>
                <SettingsScreen />
            </View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8EDF2',
    },
    backText: { fontSize: 18, color: '#27313F' },
    title: { fontSize: 18, fontWeight: '800', textAlign: 'center', flex: 1 },
    spacer: { width: 36 },
});

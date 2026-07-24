import React from 'react';
import { ScrollView, Text, StyleSheet, View, TextInput, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';
import { useUIStore } from '../store/useUIStore';
import { useTransactionStore } from '../store/useTransactionStore';

export default function SettingsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { userName, setUserName } = useUIStore();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header / Back Button */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.push('/profile')}>
                    <ArrowLeft size={20} color="#27313F" />
                </Pressable>
                <Text style={[styles.title, { color: theme.colors.onBackground }]}>Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* Profile Name Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.label, { color: theme.colors.onSurface, marginBottom: 12 }]}>Your name</Text>
                    <TextInput
                        style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.outline }]}
                        placeholder="Enter your name"
                        placeholderTextColor={theme.colors.outline}
                        value={userName}
                        onChangeText={setUserName}
                    />
                    <Text style={[styles.subtitle, { color: theme.colors.outline, marginTop: 12 }]}>
                        This name appears on the Home screen.
                    </Text>
                </View>

                {/* About Card */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.row}>
                        <Info size={20} color={theme.colors.onSurface} />
                        <View style={styles.aboutText}>
                            <Text style={[styles.label, { color: theme.colors.onSurface }]}>MoneyEx Tracker</Text>
                            <Text style={[styles.subtitle, { color: theme.colors.outline }]}>
                                Clean spending management for your daily life.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.label, { color: theme.colors.onSurface, marginBottom: 12 }]}>Danger Zone</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.outline, marginBottom: 12 }]}>
                        Reset balance, incomes and expenses. This will delete all transactions and set account balances to zero.
                    </Text>
                    <Pressable
                        style={({ pressed }) => [styles.resetButton, { opacity: pressed ? 0.7 : 1 }]}
                        onPress={() => {
                            Alert.alert('Confirm reset', 'Delete all transactions and reset account balances to zero?', [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Reset',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            await useTransactionStore.getState().resetAll();
                                            Alert.alert('Reset complete', 'All transactions deleted and balances reset.');
                                        } catch (err) {
                                            console.error('Reset failed', err);
                                            Alert.alert('Reset failed', 'An error occurred while resetting data.');
                                        }
                                    },
                                },
                            ]);
                        }}
                    >
                        <Text style={[styles.resetText, { color: '#FF4D4F' }]}>Reset all data</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [styles.resetButton, { opacity: pressed ? 0.7 : 1, marginTop: 12 }]}
                        onPress={() => {
                            Alert.alert('Reset this month', 'Delete transactions from the current month and reset account balances to zero?', [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Reset Month',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            const now = new Date();
                                            await useTransactionStore.getState().resetMonth(now.getFullYear(), now.getMonth());
                                            Alert.alert('Reset complete', 'Current month transactions deleted and balances reset.');
                                        } catch (err) {
                                            console.error('Monthly reset failed', err);
                                            Alert.alert('Reset failed', 'An error occurred while resetting monthly data.');
                                        }
                                    },
                                },
                            ]);
                        }}
                    >
                        <Text style={[styles.resetText, { color: '#FF4D4F' }]}>Reset current month</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 12,
        paddingBottom: 16,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8EDF2',
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    content: {
        paddingBottom: 40,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 4,
    },
    aboutText: {
        flex: 1,
        marginLeft: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    resetButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    resetText: {
        fontSize: 16,
        fontWeight: '800',
    },
});
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

const notifications = [
    { id: '1', title: 'Welcome to MoneyEx', description: 'Your budget tracker is ready to use.' },
    { id: '2', title: 'New transaction added', description: 'Your latest transaction has been saved.' },
    { id: '3', title: 'Tip', description: 'Swipe right on profile to return home quickly.' },
];

export default function NotificationsScreen() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                    <ArrowLeft size={20} color="#27313F" />
                </Pressable>
                <Text style={[styles.title, { color: theme.colors.onBackground }]}>Notifications</Text>
                <View style={styles.spacer} />
            </View>

            {/* List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.notificationTitle, { color: theme.colors.onBackground }]}>
                            {item.title}
                        </Text>
                        <Text style={[styles.notificationDescription, { color: theme.colors.outline }]}>
                            {item.description}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        paddingBottom: 20,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8EDF2',
    },
    title: { fontSize: 24, fontWeight: '800', flex: 1, textAlign: 'center' },
    spacer: { width: 36 },
    list: { paddingBottom: 40 },
    card: {
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
    },
    notificationTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
    notificationDescription: { fontSize: 14, lineHeight: 20 },
});
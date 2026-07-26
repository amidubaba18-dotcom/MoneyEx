import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Clock } from 'lucide-react-native';
import { useUIStore } from '../store/useUIStore';

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications } = useUIStore();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 36 }} />
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.iconWrap}>
                                <Bell size={18} color="#94A3B8" strokeWidth={2} />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <View style={styles.timeRow}>
                                    <Clock size={12} color="#94A3B8" strokeWidth={2} />
                                    <Text style={styles.timeText}>{item.time}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Bell size={48} color="#E2E8F0" strokeWidth={1.5} />
                        <Text style={styles.emptyTitle}>No notifications</Text>
                        <Text style={styles.emptyDesc}>
                            You{"'"}re all caught up! Check back later for updates.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
        backgroundColor: '#F8FAFC',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    title: { fontSize: 20, fontWeight: '700', color: '#0F172A', letterSpacing: -0.3 },
    list: { paddingHorizontal: 16, paddingBottom: 120, gap: 10 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    textContent: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
    cardDescription: { fontSize: 14, fontWeight: '400', color: '#64748B', lineHeight: 20, marginBottom: 6 },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    timeText: { fontSize: 12, fontWeight: '500', color: '#94A3B8' },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginTop: 16, marginBottom: 6 },
    emptyDesc: { fontSize: 14, fontWeight: '400', color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40, lineHeight: 20 },
});

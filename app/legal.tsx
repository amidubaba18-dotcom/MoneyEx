import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react-native';

export default function LegalScreen() {
    const router = useRouter();

    const items = ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Licenses', 'Data Processing Agreement'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.title}>Legal & Privacy</Text>
                <View style={{ width: 36 }} />
            </View>
            <View style={styles.content}>
                {items.map((item) => (
                    <View key={item} style={styles.legalItem}>
                        <FileText size={18} color="#0F172A" />
                        <Text style={styles.legalText}>{item}</Text>
                        <ChevronRight size={18} color="#94A3B8" />
                    </View>
                ))}
            </View>
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
    title: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
    content: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
    legalItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 8 },
    legalText: { fontSize: 15, fontWeight: '500', color: '#0F172A', flex: 1 },
});
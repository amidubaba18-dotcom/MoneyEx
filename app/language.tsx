import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Check } from 'lucide-react-native';

export default function LanguageScreen() {
    const router = useRouter();

    const languages = ['English (US)', 'English (UK)', 'French', 'Spanish', 'Portuguese', 'Arabic'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.title}>Language</Text>
                <View style={{ width: 36 }} />
            </View>
            <View style={styles.content}>
                {languages.map((lang) => (
                    <View key={lang} style={styles.languageItem}>
                        <Globe size={18} color="#0F172A" />
                        <Text style={styles.languageText}>{lang}</Text>
                        {lang === 'English (US)' && <Check size={18} color="#2563EB" strokeWidth={3} />}
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
    languageItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 8 },
    languageText: { fontSize: 15, fontWeight: '500', color: '#0F172A', flex: 1 },
});
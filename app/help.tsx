import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, ScrollView, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';
import { useThemeMode } from '../context/ThemeContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

const FAQ_DATA: FAQItem[] = [
    {
        id: '1',
        question: 'How do I add a transaction?',
        answer: 'Tap the "+" or "Income" / "Expenses" button on the Dashboard. Enter the amount, select a category, add a note if needed, and tap "Save".',
    },
    {
        id: '2',
        question: 'What is contrast therapy?',
        answer: 'Contrast therapy involves alternating between sauna and cold plunge sessions to improve circulation, reduce inflammation, and boost recovery.',
    },
    {
        id: '3',
        question: 'How do I reset my password?',
        answer: 'Go to Profile → Security → Change Password. Enter your current password and your new password, then confirm.',
    },
    {
        id: '4',
        question: 'How do I export my data?',
        answer: 'Go to Profile → Settings → Export Data. You can export your transactions as a CSV or PDF file.',
    },
    {
        id: '5',
        question: 'What happens to my data if I delete the app?',
        answer: 'Your data is stored locally on your device. If you delete the app, your data will be lost unless you export it first.',
    },
];

export default function HelpCenterScreen() {
    const router = useRouter();
    const { isDark } = useThemeMode();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color={isDark ? '#F1F5F9' : '#0F172A'} strokeWidth={2.5} />
                </Pressable>
                <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>Help Center</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerIcon}>
                    <HelpCircle size={48} color={isDark ? '#60A5FA' : '#0F172A'} strokeWidth={1.5} />
                    <Text style={[styles.headerTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                        Frequently Asked Questions
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                        Find answers to common questions below
                    </Text>
                </View>

                <View style={styles.faqContainer}>
                    {FAQ_DATA.map((item) => {
                        const isExpanded = expandedId === item.id;
                        return (
                            <View
                                key={item.id}
                                style={[
                                    styles.faqItem,
                                    { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
                                    isExpanded && styles.faqItemExpanded,
                                ]}
                            >
                                <Pressable
                                    style={styles.faqHeader}
                                    onPress={() => toggleExpand(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.faqQuestion, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                        {item.question}
                                    </Text>
                                    {isExpanded ? (
                                        <ChevronUp size={20} color={isDark ? '#94A3B8' : '#94A3B8'} strokeWidth={2} />
                                    ) : (
                                        <ChevronDown size={20} color={isDark ? '#94A3B8' : '#94A3B8'} strokeWidth={2} />
                                    )}
                                </Pressable>
                                {isExpanded && (
                                    <View style={styles.faqBody}>
                                        <Text style={[styles.faqAnswer, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                                            {item.answer}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                        Can't find what you're looking for?
                    </Text>
                    <Pressable
                        style={styles.contactButton}
                        onPress={() => router.push('/feedback')}
                    >
                        <Text style={styles.contactButtonText}>Send Feedback</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    content: { flex: 1 },
    contentContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    headerIcon: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        gap: 8,
    },
    headerTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
    headerSubtitle: { fontSize: 14, fontWeight: '400', textAlign: 'center' },
    faqContainer: { gap: 10 },
    faqItem: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    faqItemExpanded: {
        borderColor: '#0F172A',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        marginRight: 12,
    },
    faqBody: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    faqAnswer: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 22,
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
        gap: 12,
    },
    footerText: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});

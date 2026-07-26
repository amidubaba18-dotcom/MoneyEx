import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';

export default function FeedbackScreen() {
    const router = useRouter();
    const [feedback, setFeedback] = React.useState('');

    const handleSend = () => {
        // Handle feedback submission
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.title}>Send Feedback</Text>
                <Pressable style={styles.sendButton} onPress={handleSend}>
                    <Send size={20} color="#2563EB" strokeWidth={2.5} />
                </Pressable>
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Your Feedback</Text>
                <TextInput
                    style={styles.input}
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Tell us what you think..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />
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
    sendButton: { padding: 8 },
    content: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: '#0F172A',
        minHeight: 150,
    },
});
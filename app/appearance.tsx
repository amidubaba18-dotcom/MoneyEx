import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Sun, Moon, Monitor } from 'lucide-react-native';
import { useThemeMode } from '../context/ThemeContext';
import { ThemeMode } from '../context/ThemeContext';

type ThemeOption = {
    id: ThemeMode;
    label: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    description: string;
};

export default function AppearanceScreen() {
    const router = useRouter();
    const { mode, isDark, setMode } = useThemeMode();

    const themeOptions: ThemeOption[] = [
        { id: 'light', label: 'Light', icon: Sun, description: 'Bright and clean' },
        { id: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
        { id: 'system', label: 'System', icon: Monitor, description: 'Follows device theme' },
    ];

    const handleSelect = (selectedMode: ThemeMode) => {
        setMode(selectedMode);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color={isDark ? '#F1F5F9' : '#0F172A'} strokeWidth={2.5} />
                </Pressable>
                <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>Appearance</Text>
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                    Choose your preferred theme
                </Text>

                <View style={styles.optionsContainer}>
                    {themeOptions.map((option) => {
                        const isSelected = mode === option.id;
                        const Icon = option.icon;

                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionCard,
                                    isSelected && styles.optionCardSelected,
                                    { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
                                ]}
                                onPress={() => handleSelect(option.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.optionLeft}>
                                    <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                                        <Icon
                                            size={22}
                                            color={isSelected ? '#FFFFFF' : (isDark ? '#94A3B8' : '#0F172A')}
                                            strokeWidth={2}
                                        />
                                    </View>
                                    <View style={styles.optionText}>
                                        <Text style={[styles.optionLabel, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                            {option.label}
                                        </Text>
                                        <Text style={[styles.optionDescription, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                                            {option.description}
                                        </Text>
                                    </View>
                                </View>
                                {isSelected && (
                                    <View style={styles.checkmark}>
                                        <Check size={18} color="#0F172A" strokeWidth={3} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                        {mode === 'light' && '☀️ Light mode active'}
                        {mode === 'dark' && '🌙 Dark mode active'}
                        {mode === 'system' && '🔄 Following system theme'}
                    </Text>
                    <Text style={[styles.footerSubtext, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                        Changes apply to the entire app
                    </Text>
                </View>
            </View>
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
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
    subtitle: { fontSize: 14, fontWeight: '500', marginBottom: 24 },
    optionsContainer: { gap: 12 },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    optionCardSelected: {
        borderColor: '#0F172A',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapSelected: { backgroundColor: '#0F172A' },
    optionText: { flex: 1 },
    optionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    optionDescription: { fontSize: 13, fontWeight: '400' },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: { marginTop: 'auto', paddingVertical: 24, alignItems: 'center' },
    footerText: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    footerSubtext: { fontSize: 13, fontWeight: '400', textAlign: 'center' },
});

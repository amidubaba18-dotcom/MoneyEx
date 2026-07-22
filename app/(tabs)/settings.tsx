import React from 'react';
import { ScrollView, Text, StyleSheet, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Switch } from 'react-native-paper';
import { useUIStore } from '../../store/useUIStore';
import { Moon, Info } from 'lucide-react-native';

export default function SettingsScreen() {
    const theme = useTheme();
    const { isDarkMode, toggleTheme, userName, setUserName } = useUIStore();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>Settings</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.row}>
                        <Moon size={20} color={theme.colors.onSurface} />
                        <Text style={[styles.label, { color: theme.colors.onSurface }]}>Dark Mode</Text>
                        <Switch value={isDarkMode} onValueChange={toggleTheme} />
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.label, { color: theme.colors.onSurface, marginBottom: 12 }]}>Your name</Text>
                    <TextInput
                        style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.outline }]}
                        placeholder="Enter your name"
                        placeholderTextColor={theme.colors.outline}
                        value={userName}
                        onChangeText={setUserName}
                    />
                    <Text style={[styles.subtitle, { color: theme.colors.outline, marginTop: 12 }]}>This name appears on the Home screen.</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.row}>
                        <Info size={20} color={theme.colors.onSurface} />
                        <View style={styles.aboutText}>
                            <Text style={[styles.label, { color: theme.colors.onSurface }]}>MoneyEx Tracker</Text>
                            <Text style={[styles.subtitle, { color: theme.colors.outline }]}>Clean spending management for your daily life.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    content: { paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 24 },
    card: { borderRadius: 24, padding: 20, marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
    label: { fontSize: 16, fontWeight: '700' },
    subtitle: { fontSize: 13, marginTop: 4 },
    aboutText: { flex: 1, marginLeft: 12 },
    input: {
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
});

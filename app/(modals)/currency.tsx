import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Search, Check } from 'lucide-react-native';
import { CURRENCIES } from '../../utils/currencies';
import { useCurrencyStore } from '../../store/useCurrencyStore';

const COLORS = {
    bg: '#1A1A1A',
    textPrimary: '#F2F2F0',
    textMuted: '#8A8A87',
    hairline: 'rgba(242,242,240,0.08)',
    accent: '#F2F2F0',
};

export default function CurrencyScreen() {
    const router = useRouter();
    const selectedCode = useCurrencyStore((s) => s.code);
    const setCurrency = useCurrencyStore((s) => s.setCurrency);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return CURRENCIES;
        return CURRENCIES.filter(
            (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
        );
    }, [query]);

    const handleSelect = (code: string) => {
        setCurrency(code);
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: COLORS.textPrimary }]}>Currency</Text>
                <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                    <X size={22} color={COLORS.textPrimary} strokeWidth={2.25} />
                </TouchableOpacity>
            </View>

            <View style={[styles.searchBar, { borderColor: COLORS.hairline }]}>
                <Search size={16} color={COLORS.textMuted} strokeWidth={2} />
                <TextInput
                    style={[styles.searchInput, { color: COLORS.textPrimary }]}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search currency or code"
                    placeholderTextColor={COLORS.textMuted}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.code}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={() => <View style={[styles.hairline, { backgroundColor: COLORS.hairline }]} />}
                renderItem={({ item }) => {
                    const isSelected = item.code === selectedCode;
                    return (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => handleSelect(item.code)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.symbol, { color: COLORS.textMuted }]}>{item.symbol}</Text>
                            <View style={styles.rowText}>
                                <Text style={[styles.rowName, { color: COLORS.textPrimary }]}>{item.name}</Text>
                                <Text style={[styles.rowCode, { color: COLORS.textMuted }]}>{item.code}</Text>
                            </View>
                            {isSelected && <Check size={18} color={COLORS.accent} strokeWidth={2.5} />}
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '700' },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12,
        borderWidth: 1,
    },
    searchInput: { flex: 1, fontSize: 15, padding: 0 },

    listContent: { paddingBottom: 24 },
    hairline: { height: 1, marginHorizontal: 0 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
    symbol: { fontSize: 18, width: 32, textAlign: 'center' },
    rowText: { flex: 1 },
    rowName: { fontSize: 15 },
    rowCode: { fontSize: 12, marginTop: 2 },
});

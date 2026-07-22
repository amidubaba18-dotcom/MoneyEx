import React, { useState, useMemo } from 'react';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { Search, Filter } from 'lucide-react-native';
import { useTransactionStore } from '../../store/useTransactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { SwipeableRow } from '../../components/SwipeableRow';

export default function TransactionsScreen() {
    const theme = useTheme();
    const transactions = useTransactionStore((s) => s.transactions);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const filtered = useMemo(() => {
        let list = transactions;
        if (filter !== 'all') {
            list = list.filter((t) => t.transaction_type === filter);
        }
        if (search) {
            list = list.filter((t) =>
                t.note?.toLowerCase().includes(search.toLowerCase())
            );
        }
        return list;
    }, [transactions, filter, search]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
                Transactions
            </Text>

            {/* Search bar */}
            <View style={styles.searchRow}>
                <View style={[styles.searchBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Search size={20} color={theme.colors.outline} />
                    <TextInput
                        placeholder="Search transactions..."
                        placeholderTextColor={theme.colors.outline}
                        style={[styles.searchInput, { color: theme.colors.onSurface }]}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.filterBtn, { backgroundColor: theme.colors.surfaceVariant }]}
                    onPress={() => {
                        const next = filter === 'all' ? 'expense' : filter === 'expense' ? 'income' : 'all';
                        setFilter(next);
                    }}
                >
                    <Filter size={20} color={theme.colors.onSurface} />
                </TouchableOpacity>
            </View>

            {/* Quick filter chips */}
            <View style={styles.chips}>
                {['all', 'expense', 'income'].map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.chip,
                            {
                                backgroundColor:
                                    filter === f ? theme.colors.primary : theme.colors.surfaceVariant,
                            },
                        ]}
                        onPress={() => setFilter(f as any)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                { color: filter === f ? 'white' : theme.colors.onSurface },
                            ]}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Transaction list */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SwipeableRow transactionId={item.id}>
                        <TransactionItem transaction={item} />
                    </SwipeableRow>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        minHeight: 40,
    },
    filterBtn: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chips: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
        marginBottom: 16,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '700',
    },
    separator: {
        height: 12,
    },
});
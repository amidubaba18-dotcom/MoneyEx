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
import { Search, Filter } from 'lucide-react-native';
import { useTransactionStore } from '../../store/useTransactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { SwipeableRow } from '../../components/SwipeableRow';
import { useTabBarClearance } from './_layout';

export default function TransactionsScreen() {
    const transactions = useTransactionStore((s) => s.transactions);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const tabBarClearance = useTabBarClearance();

    const filtered = useMemo(() => {
        let list = transactions;
        if (filter !== 'all') {
            list = list.filter((t) => t.transaction_type === filter);
        }
        if (search) {
            const q = search.toLowerCase();
            list = list.filter((t) =>
                t.note?.toLowerCase().includes(q) ||
                t.category_name?.toLowerCase().includes(q) ||
                String(t.amount).toLowerCase().includes(q)
            );
        }
        return list;
    }, [transactions, filter, search]);

    const filterLabels: Record<string, string> = {
        all: 'All',
        expense: 'Expense',
        income: 'Income',
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Transactions</Text>
                <Text style={styles.pageSubtitle}>{transactions.length} total records</Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#8A94A6" />
                    <TextInput
                        placeholder="Search transactions..."
                        placeholderTextColor="#8A94A6"
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.filterBtn, filter !== 'all' && styles.filterBtnActive]}
                    onPress={() => {
                        const next = filter === 'all' ? 'expense' : filter === 'expense' ? 'income' : 'all';
                        setFilter(next);
                    }}
                >
                    <Filter size={18} color={filter !== 'all' ? '#FFFFFF' : '#111827'} />
                </TouchableOpacity>
            </View>

            {/* Quick filter chips */}
            <View style={styles.chips}>
                {(['all', 'expense', 'income'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.chip, filter === f && styles.chipActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                            {filterLabels[f]}
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
                contentContainerStyle={[styles.listContent, { paddingBottom: tabBarClearance }]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No transactions found</Text>
                        <Text style={styles.emptyDesc}>
                            {search || filter !== 'all'
                                ? 'Try adjusting your search or filter.'
                                : 'Add your first transaction to get started.'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    pageSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A94A6',
        marginTop: 4,
        letterSpacing: 0.2,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 14,
        gap: 10,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
        padding: 0,
        lineHeight: 20,
    },
    filterBtn: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    filterBtnActive: {
        backgroundColor: '#111827',
    },
    chips: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 18,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    chipActive: {
        backgroundColor: '#111827',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.1,
    },
    chipTextActive: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    separator: {
        height: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    emptyDesc: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8A94A6',
        textAlign: 'center',
        lineHeight: 20,
    },
});
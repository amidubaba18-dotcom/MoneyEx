import React, { useState, useMemo } from 'react';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
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

    // Get chip colors based on filter
    const getChipStyle = (f: 'all' | 'expense' | 'income') => {
        if (f === filter) {
            if (f === 'expense') return { backgroundColor: '#DC2626', borderColor: '#DC2626' };
            if (f === 'income') return { backgroundColor: '#2563EB', borderColor: '#2563EB' };
            return { backgroundColor: '#0F172A', borderColor: '#0F172A' };
        }
        return { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' };
    };

    const getChipTextStyle = (f: 'all' | 'expense' | 'income') => {
        if (f === filter) {
            return { color: '#FFFFFF' };
        }
        return { color: '#64748B' };
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.pageHeader}>
                <Text style={styles.pageTitle}>Transactions</Text>
                <Text style={styles.pageSubtitle}>{transactions.length} total records</Text>
            </View>

            {/* Search bar - now with solid border & shadow */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Search size={18} color="#94A3B8" strokeWidth={2.5} />
                    <TextInput
                        placeholder="Search transactions..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        filter !== 'all' && styles.filterBtnActive,
                        filter === 'expense' && { backgroundColor: '#DC2626', borderColor: '#DC2626' },
                        filter === 'income' && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                    ]}
                    onPress={() => {
                        const next = filter === 'all' ? 'expense' : filter === 'expense' ? 'income' : 'all';
                        setFilter(next);
                    }}
                >
                    <Filter size={18} color={filter !== 'all' ? '#FFFFFF' : '#0F172A'} strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            {/* Quick filter chips - now with solid colors */}
            <View style={styles.chips}>
                {(['all', 'expense', 'income'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.chip,
                            getChipStyle(f),
                            f === filter && styles.chipActive,
                            f === filter && f === 'all' && styles.chipActiveAll,
                        ]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.chipText, getChipTextStyle(f)]}>
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

// ============================================================
// UPDATED STYLES – consistent with new design language
// ============================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    pageSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: 4,
        letterSpacing: 0.2,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 10,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#0F172A',
        padding: 0,
        lineHeight: 20,
    },
    filterBtn: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    filterBtnActive: {
        backgroundColor: '#0F172A',
        borderColor: '#0F172A',
    },
    chips: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 20,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    chipActive: {
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    chipActiveAll: {
        backgroundColor: '#0F172A',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        letterSpacing: -0.1,
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
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    emptyDesc: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
});
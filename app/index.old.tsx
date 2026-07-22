import React, { useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BalanceCard } from '../components/BalanceCard';
import { QuickActions } from '../components/QuickActions';
import { useTransactionStore } from '../store/useTransactionStore';
import { TransactionItem } from '../components/TransactionItem';
import { SwipeableRow } from '../components/SwipeableRow';
import AddTransactionSheet, { AddTransactionSheetHandle } from '../components/AddTransactionSheet';
import { useTheme } from 'react-native-paper';

export default function Dashboard() {
    const theme = useTheme();
    const recentTransactions = useTransactionStore((s) => s.recentTransactions);
    const bottomSheetRef = useRef<AddTransactionSheetHandle>(null);

    const openAddSheet = (type: 'income' | 'expense') => {
        bottomSheetRef.current?.open(type);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView>
                <Text style={[styles.greeting, { color: theme.colors.onBackground }]}>
                    Hello Baba 👋
                </Text>
                <BalanceCard />
                <QuickActions
                    onAddExpense={() => openAddSheet('expense')}
                    onAddIncome={() => openAddSheet('income')}
                />
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Recent Transactions</Text>
                </View>
                {recentTransactions.map((tx) => (
                    <SwipeableRow key={tx.id} transactionId={tx.id}>
                        <TransactionItem transaction={tx} />
                    </SwipeableRow>
                ))}
            </ScrollView>
            <AddTransactionSheet ref={bottomSheetRef} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
});
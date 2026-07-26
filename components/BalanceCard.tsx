import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { useBalance } from '../hooks/useBalance';
import { formatCurrency } from '../utils/formatCurrency';

interface BalanceCardProps {
    onAddExpense: () => void;
    onAddIncome: () => void;
}

export function BalanceCard({
    onAddExpense,
    onAddIncome,
}: BalanceCardProps) {
    const { balance, income, expense } = useBalance();

    return (
        <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 90 }}
            style={styles.cardWrapper}
        >
            <View style={styles.card}>
                {/* Header: "Total balance" */}
                <View style={styles.headerRow}>
                    <Text style={styles.totalLabel}>Total balance</Text>
                </View>

                {/* Balance Amount */}
                <View style={styles.balanceRow}>
                    <Text
                        style={styles.balanceNumber}
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        minimumFontScale={0.6}
                    >
                        {formatCurrency(balance)}
                    </Text>
                </View>

                {/* Black Container: Income & Spending (Stacked Layout) */}
                <View style={styles.incomeSpendingRow}>
                    {/* Income Section */}
                    <Pressable style={styles.metricItem} onPress={onAddIncome}>
                        <View style={[styles.iconCircle, { backgroundColor: '#22C55E' }]}>
                            <ArrowUpRight size={18} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                        <Text style={styles.metricLabel}>INCOME</Text>
                        <Text
                            style={[styles.metricValue, { color: '#4ADE80' }]}
                            numberOfLines={2}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {formatCurrency(income)}
                        </Text>
                    </Pressable>

                    <View style={styles.metricDivider} />

                    {/* Spending Section */}
                    <Pressable style={styles.metricItem} onPress={onAddExpense}>
                        <View style={[styles.iconCircle, { backgroundColor: '#EF4444' }]}>
                            <ArrowDownLeft size={18} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                        <Text style={styles.metricLabel}>SPENDING</Text>
                        <Text
                            style={[styles.metricValue, { color: '#F87171' }]}
                            numberOfLines={2}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {formatCurrency(expense)}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        marginHorizontal: 16,
        marginTop: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16, // more rectangular
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    headerRow: {
        marginBottom: 6,
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
        letterSpacing: -0.1,
    },
    balanceRow: {
        marginBottom: 22,
        minHeight: 48,
    },
    balanceNumber: {
        fontSize: 38,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: -1,
        lineHeight: 44,
    },
    incomeSpendingRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: '#000000',
        borderRadius: 16, // more rectangular
        paddingVertical: 16,
        paddingHorizontal: 12,
        minHeight: 110,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.2,
        lineHeight: 20,
        textAlign: 'center',
    },
    metricDivider: {
        width: 1,
        height: 60,
        backgroundColor: '#334155',
        alignSelf: 'center',
    },
});

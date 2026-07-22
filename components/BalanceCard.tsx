import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useBalance } from '../hooks/useBalance';
import { formatCurrency } from '../utils/formatCurrency';

export function BalanceCard() {
    const { balance, income, expense } = useBalance();

    return (
        <MotiView
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300 }}
        >
            <View style={styles.card}>
                

                <Text style={styles.label}>Current Balance</Text>
                <Text style={styles.balance}>{formatCurrency(balance)}</Text>

                
            </View>

            <View style={styles.breakdown}>
                <View style={styles.col}>
                    <Text style={styles.smallLabel}>
                        <Text style={styles.iconUp}>↑ </Text>Income
                    </Text>
                    <Text style={styles.amount}>{formatCurrency(income)}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.col}>
                    <Text style={styles.smallLabel}>
                        <Text style={styles.iconDown}>↓ </Text>Expenses
                    </Text>
                    <Text style={styles.amount}>{formatCurrency(expense)}</Text>
                </View>
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#17181C',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },
    brand: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
    badge: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
        fontStyle: 'italic',
        letterSpacing: 0.5,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9A9EA6',
        marginBottom: 8,
    },
    balance: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 28,
        letterSpacing: -0.5,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardNumber: {
        fontSize: 15,
        fontWeight: '600',
        color: '#C7C9CE',
        letterSpacing: 1,
    },
    expBlock: { alignItems: 'flex-end' },
    expLabel: {
        fontSize: 11,
        color: '#8A8E96',
        marginBottom: 2,
    },
    expValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    breakdown: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    col: { flex: 1 },
    divider: {
        width: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    smallLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    iconUp: { color: '#111827', fontSize: 13 },
    iconDown: { color: '#111827', fontSize: 13 },
});

export default BalanceCard;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { TransactionRow } from '../repositories/TransactionRepository';

export function TransactionItem({ transaction }: { transaction: TransactionRow }) {
    const isIncome = transaction.transaction_type === 'income';
    const IconComp = (transaction.category_icon && (Icons as any)[transaction.category_icon]) ||
        (isIncome ? Icons.ArrowUpRight : Icons.ArrowDownLeft);

    const categoryLabel = transaction.category_name || (isIncome ? 'Income' : 'Expense');
    const dateLabel = new Date(transaction.transaction_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <View style={styles.row}>
            <View style={styles.iconBox}>
                <IconComp size={18} color="#111827" />
            </View>
            <View style={styles.info}>
                <Text style={styles.note} numberOfLines={1}>
                    {transaction.note || categoryLabel}
                </Text>
                <Text style={styles.subLabel} numberOfLines={1}>
                    {categoryLabel} · {dateLabel}
                </Text>
            </View>
            <Text style={styles.amount}>
                {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F2F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    info: { flex: 1, marginRight: 12 },
    note: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 3,
    },
    subLabel: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8A94A6',
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        minWidth: 80,
        textAlign: 'right',
    },
});
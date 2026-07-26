import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { TransactionRow } from '../repositories/TransactionRepository';

export function TransactionItem({ transaction }: { transaction: TransactionRow }) {
    const isIncome = transaction.transaction_type === 'income';
    
    // Get the icon from Lucide using the category_icon name
    let IconComp = (Icons as any)[transaction.category_icon];
    
    // Fallback if icon doesn't exist
    if (!IconComp) {
        IconComp = isIncome ? Icons.ArrowUpRight : Icons.ArrowDownLeft;
    }

    const categoryLabel = transaction.category_name || (isIncome ? 'Income' : 'Expense');
    
    let dateLabel = 'Invalid Date';
    if (transaction.transaction_date) {
        const dateObj = new Date(transaction.transaction_date);
        if (!isNaN(dateObj.getTime())) {
            dateLabel = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    }

    const categoryColor = transaction.category_color || (isIncome ? '#16A34A' : '#EF4444');

    return (
        <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: categoryColor }]}>
                <IconComp size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <View style={styles.info}>
                <Text style={styles.note} numberOfLines={1}>
                    {transaction.note || categoryLabel}
                </Text>
                <Text style={styles.subLabel} numberOfLines={1}>
                    {categoryLabel} · {dateLabel}
                </Text>
            </View>
            <Text style={[styles.amount, { color: isIncome ? '#16A34A' : '#EF4444' }]}>
                {isIncome ? '+' : '-'}GH₵{Math.abs(transaction.amount).toFixed(2)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    info: {
        flex: 1,
        marginRight: 12,
    },
    note: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    subLabel: {
        fontSize: 13,
        fontWeight: '400',
        color: '#94A3B8',
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
        minWidth: 80,
        textAlign: 'right',
    },
});

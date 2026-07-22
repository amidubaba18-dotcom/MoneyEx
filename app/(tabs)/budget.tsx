import React, { useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { useTransactionStore } from '../../store/useTransactionStore';
import { formatCurrency } from '../../utils/formatCurrency';

const VictoryPie = Platform.OS !== 'web' ? require('victory-native').VictoryPie : null;

function isSameMonth(timestamp: number, compare: Date) {
    const date = new Date(timestamp);
    return date.getMonth() === compare.getMonth() && date.getFullYear() === compare.getFullYear();
}

export default function BudgetScreen() {
    const theme = useTheme();
    const transactions = useTransactionStore((s) => s.transactions);
    const currentMonth = useMemo(() => new Date(), []);

    const monthlyTransactions = useMemo(
        () => transactions.filter((tx) => isSameMonth(tx.transaction_date, currentMonth)),
        [transactions, currentMonth]
    );

    const monthlyIncome = useMemo(
        () => monthlyTransactions.filter((tx) => tx.transaction_type === 'income').reduce((sum, tx) => sum + tx.amount, 0),
        [monthlyTransactions]
    );

    const monthlyExpense = useMemo(
        () => monthlyTransactions.filter((tx) => tx.transaction_type === 'expense').reduce((sum, tx) => sum + tx.amount, 0),
        [monthlyTransactions]
    );

    const expenseByCategory = useMemo(() => {
        const map: Record<string, { total: number; color: string; name: string }> = {};
        monthlyTransactions
            .filter((tx) => tx.transaction_type === 'expense')
            .forEach((tx) => {
                const key = tx.category_id?.toString() || 'uncategorized';
                if (!map[key]) {
                    map[key] = {
                        total: 0,
                        color: tx.category_color || '#FF6B6B',
                        name: tx.category_name || 'Other',
                    };
                }
                map[key].total += tx.amount;
            });
        return Object.values(map).sort((a, b) => b.total - a.total);
    }, [monthlyTransactions]);

    const chartData = expenseByCategory.map((cat) => ({ x: cat.name, y: cat.total, color: cat.color }));
    const topExpense = expenseByCategory[0]?.total || 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.colors.onBackground }]}>Spending</Text>
                <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.summaryLabel, { color: theme.colors.outline }]}>This month</Text>
                    <Text style={[styles.summaryValue, { color: theme.colors.onBackground }]}>{formatCurrency(monthlyExpense)}</Text>
                    <View style={styles.metricRow}>
                        <View style={styles.metricBlock}>
                            <Text style={[styles.metricLabel, { color: theme.colors.outline }]}>Income</Text>
                            <Text style={[styles.metricValue, { color: theme.colors.secondary }]}>{formatCurrency(monthlyIncome)}</Text>
                        </View>
                        <View style={styles.metricBlock}>
                            <Text style={[styles.metricLabel, { color: theme.colors.outline }]}>Net</Text>
                            <Text style={[styles.metricValue, { color: theme.colors.primary }]}>{formatCurrency(monthlyIncome - monthlyExpense)}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
                    {chartData.length ? (
                        VictoryPie ? (
                            <VictoryPie
                                data={chartData}
                                innerRadius={72}
                                padAngle={2}
                                colorScale={chartData.map((d) => d.color)}
                                style={{ labels: { fill: 'transparent' } }}
                                height={260}
                            />
                        ) : (
                            <View style={styles.webChartFallback}>
                                <Text style={[styles.webChartTitle, { color: theme.colors.onBackground }]}>Spending breakdown is unavailable on web.</Text>
                                <Text style={[styles.emptyText, { color: theme.colors.outline }]}>Use the app on mobile for the pie chart, or check the category totals below.</Text>
                            </View>
                        )
                    ) : (
                        <Text style={[styles.emptyText, { color: theme.colors.outline }]}>No expense data yet. Add transactions to see your spending breakdown.</Text>
                    )}
                </View>

                {expenseByCategory.length ? (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Top categories</Text>
                        {expenseByCategory.map((cat, idx) => {
                            const percent = topExpense ? (cat.total / topExpense) * 100 : 0;
                            return (
                                <View key={idx} style={styles.categoryRow}>
                                    <View style={styles.categoryLabelRow}>
                                        <View style={[styles.dot, { backgroundColor: cat.color }]} />
                                        <View>
                                            <Text style={[styles.categoryName, { color: theme.colors.onBackground }]}>{cat.name}</Text>
                                            <Text style={[styles.categoryAmount, { color: theme.colors.outline }]}>{formatCurrency(cat.total)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: cat.color }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 16 },
    summaryCard: { borderRadius: 24, padding: 22, marginBottom: 20 },
    summaryLabel: { fontSize: 14, marginBottom: 10 },
    summaryValue: { fontSize: 36, fontWeight: '800', marginBottom: 20 },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    metricBlock: { flex: 1 },
    metricLabel: { fontSize: 12, marginBottom: 6 },
    metricValue: { fontSize: 18, fontWeight: '700' },
    chartCard: { borderRadius: 24, padding: 20, marginBottom: 20, minHeight: 260, justifyContent: 'center' },
    emptyText: { textAlign: 'center', fontSize: 15, paddingVertical: 32 },
    section: { marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
    categoryRow: { marginBottom: 18 },
    categoryLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
    categoryName: { fontSize: 15, fontWeight: '700' },
    categoryAmount: { fontSize: 13 },
    progressTrack: { height: 6, borderRadius: 6, backgroundColor: '#E5E7EB', overflow: 'hidden' },
    progressFill: { height: 6, borderRadius: 6 },
    webChartFallback: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        paddingHorizontal: 20,
    },
    webChartTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
});

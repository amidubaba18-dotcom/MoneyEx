import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useTabBarClearance } from './_layout';
import { useFormatCurrency } from '../../utils/formatCurrency';

// ---------------------------------------------------------------------------
// Full redesign: hero card (total + MoM delta), SVG donut for category
// split, ranked category list. Still the same dark neutral system as the
// rest of the app — this isn't a new palette, just more considered structure.
// ---------------------------------------------------------------------------

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

interface CategorySlice {
    name: string;
    total: number;
    color: string;
}

// Distinct, muted-but-legible palette for chart slices when a category has
// no color of its own — cycles if there are more categories than colors.
const FALLBACK_PALETTE = ['#D98E3F', '#3B82F6', '#22C55E', '#EC4899', '#8B5CF6', '#14B8A6'];

const COLORS = {
    bg: '#1A1A1A',
    textPrimary: '#F2F2F0',
    textMuted: '#8A8A87',
    hairline: 'rgba(242,242,240,0.08)',
    accent: '#F2F2F0',
    card: '#242424',
    positive: '#4ADE80',
    negative: '#F87171',
    textOuter: '#32CD32',

};

const DonutChart = ({ slices, total, size = 176, strokeWidth = 22, formatCurrency }: {
    slices: CategorySlice[]; total: number; size?: number; strokeWidth?: number;
    formatCurrency: (amount: number) => string;

}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={COLORS.hairline} strokeWidth={strokeWidth} fill="none"
                />
                {total > 0 && slices.map((slice) => {
                    const fraction = slice.total / total;
                    const dashLength = circumference * fraction;
                    const gap = circumference - dashLength;
                    const offset = -cumulativeOffset * circumference;
                    cumulativeOffset += fraction;
                    return (
                        <Circle
                            key={slice.name}
                            cx={size / 2} cy={size / 2} r={radius}
                            stroke={slice.color} strokeWidth={strokeWidth} fill="none"
                            strokeDasharray={`${dashLength} ${gap}`}
                            strokeDashoffset={offset}
                        />
                    );
                })}
            </Svg>
            <View style={styles.donutCenter}>
                <Text style={styles.donutTotal}>{formatCurrency(total)}</Text>
                <Text style={styles.donutLabel}>total spent</Text>
            </View>
        </View>
    );
};

export default function ReportsScreen() {
    const transactions = useTransactionStore((s) => s.transactions);
    const tabBarClearance = useTabBarClearance();
    const formatCurrency = useFormatCurrency();

    const [viewedMonth, setViewedMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const monthStart = viewedMonth;
    const monthEnd = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1);
    const prevMonthStart = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1);
    const prevMonthEnd = monthStart;

    const monthLabel = viewedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const goToPrevMonth = () => setViewedMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1));
    const goToNextMonth = () => setViewedMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1));

    const monthlyExpenses = useMemo(() => {
        return transactions.filter(t => {
            const d = new Date(t.transaction_date);
            return t.transaction_type === 'expense' && d >= monthStart && d < monthEnd;
        });
    }, [transactions, monthStart, monthEnd]);

    const prevMonthExpenses = useMemo(() => {
        return transactions.filter(t => {
            const d = new Date(t.transaction_date);
            return t.transaction_type === 'expense' && d >= prevMonthStart && d < prevMonthEnd;
        });
    }, [transactions, prevMonthStart, prevMonthEnd]);

    const totalSpent = useMemo(() => monthlyExpenses.reduce((sum, t) => sum + t.amount, 0), [monthlyExpenses]);
    const prevTotalSpent = useMemo(() => prevMonthExpenses.reduce((sum, t) => sum + t.amount, 0), [prevMonthExpenses]);

    const momDelta = prevTotalSpent > 0 ? ((totalSpent - prevTotalSpent) / prevTotalSpent) * 100 : null;
    const momIsUp = (momDelta ?? 0) >= 0;

    const now = new Date();
    const isCurrentMonth = monthStart.getFullYear() === now.getFullYear() && monthStart.getMonth() === now.getMonth();
    const daysElapsed = isCurrentMonth
        ? now.getDate()
        : new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    const dailyAverage = totalSpent / Math.max(1, daysElapsed);

    const categoryBreakdown = useMemo((): CategorySlice[] => {
        const map: Record<string, CategorySlice> = {};
        monthlyExpenses.forEach((t) => {
            const key = t.category_name || 'Other';
            if (!map[key]) {
                map[key] = {
                    name: key,
                    total: 0,
                    color: t.category_color || FALLBACK_PALETTE[Object.keys(map).length % FALLBACK_PALETTE.length],
                };
            }
            map[key].total += t.amount;
        });
        return Object.values(map).sort((a, b) => b.total - a.total);
    }, [monthlyExpenses]);

    const topCategory = categoryBreakdown[0];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]} edges={['top']}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: COLORS.textPrimary }]}>Analytics</Text>

                {/* Month navigation */}
                <View style={styles.monthNav}>
                    <Pressable
                        onPress={goToPrevMonth}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Previous month"
                    >
                        <ChevronLeft size={20} color={COLORS.textPrimary} strokeWidth={2} />
                    </Pressable>
                    <Text style={[styles.monthLabel, { color: COLORS.textOuter }]}>{monthLabel}</Text>
                    <Pressable
                        onPress={goToNextMonth}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Next month"
                    >
                        <ChevronRight size={20} color={COLORS.textPrimary} strokeWidth={2} />
                    </Pressable>
                </View>

                {/* Hero card */}
                <View style={[styles.heroCard, { backgroundColor: COLORS.card, borderColor: COLORS.hairline }]}>
                    <View style={styles.heroTop}>
                        <View>
                            <Text style={[styles.heroLabel, { color: COLORS.textMuted }]}>Total spent</Text>
                            <Text style={[styles.heroAmount, { color: COLORS.textPrimary }]}>{formatCurrency(totalSpent)}</Text>
                        </View>
                        {momDelta !== null && (
                            <View style={[styles.deltaPill, momIsUp ? styles.deltaPillUp : styles.deltaPillDown]}>
                                {momIsUp ? (
                                    <ArrowUp size={12} color={COLORS.negative} strokeWidth={2.5} />
                                ) : (
                                    <ArrowDown size={12} color={COLORS.positive} strokeWidth={2.5} />
                                )}
                                <Text style={[styles.deltaText, { color: momIsUp ? COLORS.negative : COLORS.positive }]}>
                                    {Math.abs(momDelta).toFixed(0)}% vs last month
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={[styles.heroStatsRow, { borderTopColor: COLORS.hairline }]}>
                        <View style={styles.heroStat}>
                            <Text style={[styles.heroStatLabel, { color: COLORS.textMuted }]}>Daily average</Text>
                            <Text style={[styles.heroStatValue, { color: COLORS.textPrimary }]}>{formatCurrency(dailyAverage)}</Text>
                        </View>
                        <View style={[styles.heroStatDivider, { backgroundColor: COLORS.hairline }]} />
                        <View style={styles.heroStat}>
                            <Text style={[styles.heroStatLabel, { color: COLORS.textMuted }]}>Top category</Text>
                            <Text style={[styles.heroStatValue, { color: COLORS.textPrimary }]} numberOfLines={1}>
                                {topCategory ? topCategory.name : '—'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Donut + category list */}
                {categoryBreakdown.length > 0 ? (
                    <>
                        <View style={styles.chartSection}>
                            <DonutChart slices={categoryBreakdown} total={totalSpent} formatCurrency={formatCurrency} />
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: COLORS.textMuted }]}>Breakdown</Text>
                            {categoryBreakdown.map((cat, i) => {
                                const percentage = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
                                return (
                                    <View
                                        key={cat.name}
                                        style={[styles.categoryRow, i < categoryBreakdown.length - 1 && styles.rowDivider, { borderBottomColor: COLORS.hairline }]}
                                    >
                                        <Text style={[styles.rankText, { color: COLORS.textMuted }]}>{i + 1}</Text>
                                        <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                                        <Text style={[styles.categoryName, { color: COLORS.textPrimary }]} numberOfLines={1}>{cat.name}</Text>
                                        <Text style={[styles.categoryPercent, { color: COLORS.textMuted }]}>{percentage.toFixed(0)}%</Text>
                                        <Text style={[styles.categoryAmount, { color: COLORS.textPrimary }]}>{formatCurrency(cat.total)}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: COLORS.textMuted }]}>No expenses in {monthLabel}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 24 },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 18,
        marginBottom: 24,
    },

    monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 , marginTop: 20 },
    monthLabel: { fontSize: 18, color: COLORS.textOuter, minWidth: 130, textAlign: 'center' },

    heroCard: {
        borderRadius: 20, padding: 20,
        marginBottom: 28, borderWidth: 1,
    },
    heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    heroLabel: { fontSize: 13, marginBottom: 6 },
    heroAmount: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5, fontVariant: ['tabular-nums'] },

    deltaPill: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 8, paddingVertical: 5, borderRadius: 100,
    },
    deltaPillUp: { backgroundColor: 'rgba(248,113,113,0.12)' },
    deltaPillDown: { backgroundColor: 'rgba(74,222,128,0.12)' },
    deltaText: { fontSize: 11, fontWeight: '700' },

    heroStatsRow: {
        flexDirection: 'row', alignItems: 'center',
        marginTop: 20, paddingTop: 16, borderTopWidth: 1,
    },
    heroStat: { flex: 1 },
    heroStatLabel: { fontSize: 12, marginBottom: 4 },
    heroStatValue: { fontSize: 15, fontWeight: '600' },
    heroStatDivider: { width: 1, height: 28, marginHorizontal: 16 },

    chartSection: { alignItems: 'center', marginBottom: 32 },
    donutCenter: { position: 'absolute', alignItems: 'center' },
    donutTotal: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'], color: COLORS.textPrimary },
    donutLabel: { fontSize: 11, marginTop: 2, color: COLORS.textMuted },

    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },

    categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
    rowDivider: { borderBottomWidth: 1 },
    rankText: { fontSize: 12, width: 14 },
    categoryDot: { width: 8, height: 8, borderRadius: 4 },
    categoryName: { fontSize: 15, flex: 1 },
    categoryPercent: { fontSize: 13, minWidth: 34, textAlign: 'right' },
    categoryAmount: { fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'], minWidth: 84, textAlign: 'right' },

    emptyState: { paddingVertical: 60, alignItems: 'center' },
    emptyText: { fontSize: 14 },
});
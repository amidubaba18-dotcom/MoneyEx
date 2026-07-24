import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTransactionStore } from '../../store/useTransactionStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTabBarClearance } from './_layout';

type PeriodKey = 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';

const PERIODS: { key: PeriodKey; label: string }[] = [
    { key: 'thisWeek', label: 'This Week' },
    { key: 'lastWeek', label: 'Last Week' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'lastMonth', label: 'Last Month' },
];

const CATEGORY_FALLBACK_COLORS = ['#4ADE80', '#38BDF8', '#A78BFA', '#9CA3AF', '#FBBF24', '#F472B6'];

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d: Date) {
    const s = startOfDay(d);
    s.setDate(s.getDate() - s.getDay());
    return s;
}

function addDays(d: Date, n: number) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}

function getPeriodRange(period: PeriodKey, now: Date) {
    switch (period) {
        case 'thisWeek': {
            const start = startOfWeek(now);
            return { start, end: startOfDay(now) };
        }
        case 'lastWeek': {
            const thisWeekStart = startOfWeek(now);
            const end = addDays(thisWeekStart, -1);
            const start = startOfWeek(end);
            return { start, end };
        }
        case 'thisMonth': {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            return { start, end: startOfDay(now) };
        }
        case 'lastMonth': {
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            return { start, end };
        }
    }
}

function getPreviousRange(start: Date, end: Date) {
    const lengthMs = end.getTime() - start.getTime();
    const prevEnd = addDays(start, -1);
    const prevStart = new Date(prevEnd.getTime() - lengthMs);
    return { start: startOfDay(prevStart), end: startOfDay(prevEnd) };
}

function formatRangeLabel(start: Date, end: Date) {
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${fmt(start)} - ${fmt(end)}`;
}

function line(a: { x: number; y: number }, b: { x: number; y: number }) {
    const lx = b.x - a.x;
    const ly = b.y - a.y;
    return { length: Math.sqrt(lx * lx + ly * ly), angle: Math.atan2(ly, lx) };
}

function controlPoint(
    current: { x: number; y: number },
    prev: { x: number; y: number } | undefined,
    next: { x: number; y: number } | undefined,
    reverse?: boolean
) {
    const p = prev || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    return { x: current.x + Math.cos(angle) * length, y: current.y + Math.sin(angle) * length };
}

function buildSmoothPath(points: { x: number; y: number }[]) {
    return points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const cps = controlPoint(arr[i - 1], arr[i - 2], point);
        const cpe = controlPoint(point, arr[i - 1], arr[i + 1], true);
        return `${acc} C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
    }, '');
}

export default function SpendingAnalyticsScreen() {
    const { width } = useWindowDimensions();
    const transactions = useTransactionStore((s) => s.transactions);
    const [period, setPeriod] = useState<PeriodKey>('thisMonth');
    const tabBarClearance = useTabBarClearance();

    const now = useMemo(() => new Date(), []);
    const { start, end } = useMemo(() => getPeriodRange(period, now), [period, now]);
    const { start: prevStart, end: prevEnd } = useMemo(() => getPreviousRange(start, end), [start, end]);

    const inRange = (ts: number, rangeStart: Date, rangeEnd: Date) => {
        const d = new Date(ts);
        return d >= rangeStart && d <= new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate(), 23, 59, 59, 999);
    };

    const currentExpenses = useMemo(
        () => transactions.filter((t) => t.transaction_type === 'expense' && inRange(t.transaction_date, start, end)),
        [transactions, start, end]
    );

    const previousExpenses = useMemo(
        () => transactions.filter((t) => t.transaction_type === 'expense' && inRange(t.transaction_date, prevStart, prevEnd)),
        [transactions, prevStart, prevEnd]
    );

    const totalSpent = useMemo(() => currentExpenses.reduce((sum, t) => sum + t.amount, 0), [currentExpenses]);
    const previousSpent = useMemo(() => previousExpenses.reduce((sum, t) => sum + t.amount, 0), [previousExpenses]);

    const percentChange = useMemo(() => {
        if (previousSpent === 0) return totalSpent === 0 ? 0 : 100;
        return ((totalSpent - previousSpent) / previousSpent) * 100;
    }, [totalSpent, previousSpent]);

    const isIncrease = percentChange > 0;
    const trendColor = isIncrease ? '#EF4444' : '#16A34A';

    const dailyTotals = useMemo(() => {
        const dayCount = Math.max(1, Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / 86400000) + 1);
        const buckets = Array.from({ length: dayCount }, (_, i) => ({ date: addDays(start, i), total: 0 }));
        currentExpenses.forEach((t) => {
            const d = startOfDay(new Date(t.transaction_date));
            const idx = Math.round((d.getTime() - startOfDay(start).getTime()) / 86400000);
            if (buckets[idx]) buckets[idx].total += t.amount;
        });
        return buckets;
    }, [currentExpenses, start, end]);

    const categoryBreakdown = useMemo(() => {
        const map: Record<string, { total: number; color: string; name: string }> = {};
        currentExpenses.forEach((t) => {
            const key = t.category_id?.toString() || 'uncategorized';
            if (!map[key]) {
                map[key] = { total: 0, color: '', name: t.category_name || 'Other' };
            }
            map[key].total += t.amount;
        });
        const sorted = Object.values(map).sort((a, b) => b.total - a.total);
        const top = sorted.slice(0, 4);
        const rest = sorted.slice(4);
        const restTotal = rest.reduce((sum, c) => sum + c.total, 0);

        const withColors = top.map((c, i) => ({ ...c, color: CATEGORY_FALLBACK_COLORS[i] }));
        if (restTotal > 0) {
            withColors.push({ total: restTotal, color: CATEGORY_FALLBACK_COLORS[4] || '#9CA3AF', name: 'Others' });
        }
        return withColors.map((c) => ({
            ...c,
            percent: totalSpent > 0 ? (c.total / totalSpent) * 100 : 0,
        }));
    }, [currentExpenses, totalSpent]);

    const chartWidth = width - 32 - 40;
    const chartHeight = 130;
    const maxVal = Math.max(...dailyTotals.map((d) => d.total), 1) * 1.2;

    const points = dailyTotals.map((d, i) => ({
        x: dailyTotals.length > 1 ? (i / (dailyTotals.length - 1)) * chartWidth : chartWidth / 2,
        y: chartHeight - (d.total / maxVal) * chartHeight,
    }));

    const pathD = points.length > 1 ? buildSmoothPath(points) : '';
    const lastPoint = points[points.length - 1];

    const labelStep = Math.max(1, Math.ceil(dailyTotals.length / 6));
    const xLabels = dailyTotals
        .map((d, i) => ({ i, label: d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }))
        .filter((d) => d.i % labelStep === 0 || d.i === dailyTotals.length - 1);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Spending Analytics</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {PERIODS.map((p) => {
                        const selected = p.key === period;
                        return (
                            <TouchableOpacity
                                key={p.key}
                                style={[
                                    styles.filterChip,
                                    selected && styles.filterChipActive,
                                ]}
                                onPress={() => setPeriod(p.key)}
                            >
                                <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
                                    {p.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <Text style={styles.dateRange}>{formatRangeLabel(start, end)}</Text>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>
                        Spent {PERIODS.find((p) => p.key === period)?.label.toLowerCase()}
                    </Text>
                    <View style={styles.spendRow}>
                        <Text style={styles.spendValue}>{formatCurrency(totalSpent)}</Text>
                        <View style={styles.changeBadge}>
                            {isIncrease ? (
                                <ArrowUpRight size={14} color={trendColor} />
                            ) : (
                                <ArrowDownRight size={14} color={trendColor} />
                            )}
                            <Text style={[styles.changeText, { color: trendColor }]}>
                                {Math.abs(percentChange).toFixed(1)}%
                            </Text>
                        </View>
                    </View>

                    {dailyTotals.length > 1 ? (
                        <View style={styles.chartWrap}>
                            <Svg width={chartWidth} height={chartHeight + 20}>
                                <Path d={pathD} stroke={trendColor} strokeWidth={2.5} fill="none" />
                                {lastPoint ? (
                                    <>
                                        <Circle cx={lastPoint.x} cy={lastPoint.y} r={9} fill={trendColor} opacity={0.18} />
                                        <Circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill={trendColor} />
                                    </>
                                ) : null}
                            </Svg>
                            <View style={styles.xLabelRow}>
                                {xLabels.map((l) => (
                                    <Text key={l.i} style={styles.xLabel}>
                                        {l.label}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>Not enough data yet to show a trend.</Text>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Spending by Category</Text>

                    {categoryBreakdown.length ? (
                        <>
                            <View style={styles.segmentedBar}>
                                {categoryBreakdown.map((c, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.segment,
                                            { flex: Math.max(c.percent, 2), backgroundColor: c.color },
                                        ]}
                                    />
                                ))}
                            </View>

                            <View style={styles.legendGrid}>
                                {categoryBreakdown.map((c, i) => (
                                    <View key={i} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: c.color }]} />
                                        <Text style={styles.legendName} numberOfLines={1}>
                                            {c.name}
                                        </Text>
                                        <Text style={styles.legendPercent}>{c.percent.toFixed(1)}%</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.emptyText}>No expenses in this period yet.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    scrollContent: {},
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
        paddingHorizontal: 20,
        marginBottom: 26,
        marginTop: 8,
    },
    filterRow: {
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 12,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8A94A6',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    dateRange: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A94A6',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8A94A6',
        marginBottom: 8,
    },
    spendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    spendValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '700',
    },
    chartWrap: { marginTop: 12 },
    xLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    xLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#8A94A6',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 16,
    },
    segmentedBar: {
        flexDirection: 'row',
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
        gap: 3,
        marginBottom: 20,
    },
    segment: {
        borderRadius: 6,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    legendItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        paddingRight: 8,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        flexShrink: 1,
        marginRight: 6,
    },
    legendPercent: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8A94A6',
        marginLeft: 'auto',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8A94A6',
        textAlign: 'center',
        paddingVertical: 24,
    },
});
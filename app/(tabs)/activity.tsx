import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SectionList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    Car,
    Utensils,
    Lightbulb,
    Film,
    HeartPulse,
    GraduationCap,
    Plane,
    Gift,
    ShoppingBag,
    Coffee,
    Smartphone,
    PawPrint,
    Wallet,
    Circle,
    LucideIcon,
} from 'lucide-react-native';
import { useTransactionStore } from '../../store/useTransactionStore';
import { useTabBarClearance } from './_layout';
import { formatCurrency } from '../../utils/formatCurrency';

// ---------------------------------------------------------------------------
// Same design language as the Summary screen: dark neutral bg, one off-white
// accent, hairline dividers, solid-color icon swatch with a white glyph.
// Added: month navigation (prev/next), matching the reference screenshot.
// ---------------------------------------------------------------------------

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    ShoppingCart, Car, Utensils, Lightbulb, Film, HeartPulse,
    GraduationCap, Plane, Gift, ShoppingBag, Coffee, Smartphone, PawPrint,
    Wallet, Circle,
};

const getCategoryIcon = (iconName?: string): LucideIcon =>
    CATEGORY_ICONS[iconName ?? ''] ?? Circle;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDateHeader = (date: Date) => {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(new Date(today.getTime() - 86400000));
    const d = startOfDay(date);

    if (d.getTime() === today.getTime()) {
        return `Today · ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
    } else if (d.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    }
};

export default function ActivityScreen() {
    const router = useRouter();
    const transactions = useTransactionStore((s) => s.transactions);
    const tabBarClearance = useTabBarClearance();

    // Tracks which month is being viewed — defaults to the current month.
    const [viewedMonth, setViewedMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const monthStart = viewedMonth;
    const monthEnd = new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1);

    const goToPrevMonth = () =>
        setViewedMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() - 1, 1));
    const goToNextMonth = () =>
        setViewedMonth(new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 1));

    const monthlyExpenses = useMemo(() => {
        return transactions
            .filter(t => {
                const d = new Date(t.transaction_date);
                return t.transaction_type === 'expense' && d >= monthStart && d < monthEnd;
            })
            .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
    }, [transactions, monthStart, monthEnd]);

    const groupedData = useMemo(() => {
        const groups: Record<string, { date: Date; data: typeof monthlyExpenses }> = {};
        monthlyExpenses.forEach(tx => {
            const d = new Date(tx.transaction_date);
            const key = startOfDay(d).toISOString();
            if (!groups[key]) groups[key] = { date: d, data: [] };
            groups[key].data.push(tx);
        });
        return Object.values(groups).map(group => ({
            title: formatDateHeader(group.date),
            data: group.data,
        }));
    }, [monthlyExpenses]);

    const totalSpent = useMemo(
        () => monthlyExpenses.reduce((sum, t) => sum + t.amount, 0),
        [monthlyExpenses]
    );

    const monthLabel = viewedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const renderTransaction = ({ item }: { item: typeof monthlyExpenses[0] }) => {
        const date = new Date(item.transaction_date);
        const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const color = item.category_color || COLORS.textMuted;
        const Icon = getCategoryIcon(item.category_icon);

        return (
            <View style={styles.row}>
                <View style={[styles.iconWrapper, { backgroundColor: color }]}>
                    <Icon size={16} color="#FFFFFF" strokeWidth={2} />
                </View>
                <View style={styles.rowTextBlock}>
                    <Text style={styles.rowLabel}>{item.category_name || 'Expense'}</Text>
                    <Text style={styles.rowTime}>{timeStr}</Text>
                </View>
                <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
            </View>
        );
    };

    const renderSectionHeader = ({ section }: { section: { title: string; data: any[] } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses this month</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.title}>Transactions</Text>

            {/* Month navigation */}
            <View style={styles.monthNav}>
                <Pressable
                    onPress={goToPrevMonth}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Previous month"
                >
                    <ChevronLeft size={22} color={COLORS.textPrimary} strokeWidth={2} />
                </Pressable>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <Pressable
                    onPress={goToNextMonth}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Next month"
                >
                    <ChevronRight size={22} color={COLORS.textPrimary} strokeWidth={2} />
                </Pressable>
            </View>

            {/* Totals row */}
            <View style={[styles.row, styles.totalsRow]}>
                <Text style={styles.rowLabel}>{monthlyExpenses.length} transactions</Text>
                <Text style={styles.rowAmount}>{formatCurrency(totalSpent)}</Text>
            </View>

            <SectionList
                sections={groupedData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTransaction}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: tabBarClearance + 24 },
                    groupedData.length === 0 && styles.emptyListContent,
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                ItemSeparatorComponent={() => <View style={styles.hairline} />}
            />

            <Pressable
                style={({ pressed }) => [
                    styles.fab,
                    { bottom: tabBarClearance + 16 },
                    pressed && { transform: [{ scale: 0.94 }] },
                ]}
                onPress={() => router.push('/add-expense')}
                accessibilityRole="button"
                accessibilityLabel="Add expense"
                hitSlop={8}
            >
                <Plus size={20} color={COLORS.bg} strokeWidth={2.5} />
            </Pressable>
        </SafeAreaView>
    );
}

const COLORS = {
    bg: '#1A1A1A',
    textPrimary: '#F2F2F0',
    textMuted: '#8A8A87',
    hairline: 'rgba(242,242,240,0.08)',
    accent: '#F2F2F0',
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    title: {
        fontSize: 22, fontWeight: '600', color: COLORS.textPrimary,
        marginTop: 4, marginBottom: 16, paddingHorizontal: 24,
    },
    monthNav: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 20, paddingBottom: 16,
    },
    monthLabel: { fontSize: 17, fontWeight: '600', color: COLORS.textPrimary, minWidth: 140, textAlign: 'center' },

    listContent: { paddingHorizontal: 24 },
    emptyListContent: { flex: 1, justifyContent: 'center' },

    totalsRow: { paddingHorizontal: 24, paddingVertical: 14, marginBottom: 4, justifyContent: 'space-between' },
    sectionHeader: { paddingTop: 20, paddingBottom: 8 },
    sectionHeaderText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    hairline: { borderBottomWidth: 1, borderBottomColor: COLORS.hairline },
    rowTextBlock: { flex: 1 },
    rowLabel: { fontSize: 16, color: COLORS.textPrimary },
    rowTime: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
    rowAmount: { fontSize: 16, fontVariant: ['tabular-nums'], color: COLORS.textPrimary },

    iconWrapper: {
        width: 32, height: 32, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
    },

    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 14, color: COLORS.textMuted },

    fab: {
        position: 'absolute', right: 24,
        width: 52, height: 52, borderRadius: 26,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: COLORS.accent,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});
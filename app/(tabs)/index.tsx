import React, { useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Plus,
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
// Minimal pass: one neutral accent, no rings/segments, generous whitespace,
// thin hairline dividers instead of cards. Category icon is a solid color
// swatch with a white glyph on it. Typography now matches the Reports screen
// (uppercase section labels) so the app reads as one consistent system.
// ---------------------------------------------------------------------------

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  ShoppingCart, Car, Utensils, Lightbulb, Film, HeartPulse,
  GraduationCap, Plane, Gift, ShoppingBag, Coffee, Smartphone, PawPrint,
  Wallet, Circle,
};

const getCategoryIcon = (iconName?: string): LucideIcon =>
  CATEGORY_ICONS[iconName ?? ''] ?? Circle;

interface CategoryTotal {
  name: string;
  total: number;
  icon: string;
  color: string;
}

// One neutral off-white accent, everything else grayscale.
const COLORS = {
  bg: '#1A1A1A',
  textPrimary: '#F2F2F0',
  textMuted: '#8A8A87',
  hairline: 'rgba(242,242,240,0.08)',
  accent: '#F2F2F0',
};

export default function SummaryScreen() {
  const router = useRouter();
  const transactions = useTransactionStore((s) => s.transactions);
  const tabBarClearance = useTabBarClearance();

  const now = new Date();
  const monthStart = startOfMonth(now);
  const todayStart = startOfDay(now);
  const dayKey = todayStart.toISOString().slice(0, 10);

  const monthlyExpenses = useMemo(() => transactions.filter(t => {
    const d = new Date(t.transaction_date);
    return t.transaction_type === 'expense' && d >= monthStart && d <= now;
  }), [transactions, dayKey]);

  const totalSpent = useMemo(
    () => monthlyExpenses.reduce((sum, t) => sum + t.amount, 0),
    [monthlyExpenses]
  );

  const daysPassed = useMemo(() => {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const diff = now.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }, [dayKey]);

  const dailyAverage = totalSpent / daysPassed;

  const topCategories = useMemo(() => {
    const totals: Record<string, CategoryTotal> = {};
    monthlyExpenses.forEach(t => {
      const key = t.category_name || 'Other';
      if (!totals[key]) {
        totals[key] = {
          name: key,
          total: 0,
          icon: t.category_icon || 'Circle',
          color: t.category_color || COLORS.textMuted,
        };
      }
      totals[key].total += t.amount;
    });
    return Object.values(totals).sort((a, b) => b.total - a.total).slice(0, 2);
  }, [monthlyExpenses]);

  const todaysExpenses = useMemo(() => transactions
    .filter(t => {
      const d = new Date(t.transaction_date);
      return t.transaction_type === 'expense' && d >= todayStart && d <= now;
    })
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()),
    [transactions, dayKey]
  );

  const todaysTotal = useMemo(() => todaysExpenses.reduce((sum, t) => sum + t.amount, 0), [todaysExpenses]);
  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Overview</Text>

        <View style={styles.heroSection}>
          <Text style={styles.heroMonth}>{monthName}</Text>
          <Text style={styles.heroAmount}>{formatCurrency(totalSpent)}</Text>
          <Text style={styles.heroSubtext}>{formatCurrency(dailyAverage)} a day on average</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top categories</Text>
          {topCategories.length > 0 ? (
            topCategories.map((cat, i) => {
              const Icon = getCategoryIcon(cat.icon);
              const pct = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
              return (
                <View
                  key={cat.name}
                  style={[styles.row, i < topCategories.length - 1 && styles.rowDivider]}
                >
                  <View style={[styles.categoryIconWrapper, { backgroundColor: cat.color }]}>
                    <Icon size={16} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <Text style={styles.rowLabel} numberOfLines={1}>{cat.name}</Text>
                  <Text style={styles.rowPercent}>{pct.toFixed(0)}%</Text>
                  <Text style={styles.rowAmount}>{formatCurrency(cat.total)}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No spending this month</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Today{todaysTotal > 0 ? ` · ${formatCurrency(todaysTotal)}` : ''}
          </Text>
          {todaysExpenses.length > 0 ? (
            todaysExpenses.map((tx, i) => {
              const Icon = getCategoryIcon(tx.category_icon);
              const date = new Date(tx.transaction_date);
              const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return (
                <View
                  key={tx.id}
                  style={[styles.row, i < todaysExpenses.length - 1 && styles.rowDivider]}
                >
                  <View style={[styles.categoryIconWrapper, { backgroundColor: tx.category_color || COLORS.textMuted }]}>
                    <Icon size={16} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.rowTextBlock}>
                    <Text style={styles.rowLabel}>{tx.category_name || 'Expense'}</Text>
                    <Text style={styles.rowTime}>{timeStr}</Text>
                  </View>
                  <Text style={styles.rowAmount}>{formatCurrency(tx.amount)}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No expenses today</Text>
          )}
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 24 },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 4,
    marginBottom: 24,
  },

  heroSection: { marginBottom: 40 },
  heroMonth: { fontSize: 14, color: COLORS.textMuted, marginBottom: 4 },
  heroAmount: {
    fontSize: 38,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  heroSubtext: { fontSize: 15, color: COLORS.textMuted, marginTop: 6 },

  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.textMuted,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.hairline },
  rowTextBlock: { flex: 1 },
  rowLabel: { fontSize: 16, color: COLORS.textPrimary, flex: 1, flexShrink: 1 },
  rowTime: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  rowPercent: { fontSize: 13, color: COLORS.textMuted, marginRight: 10 },
  rowAmount: { fontSize: 16, fontVariant: ['tabular-nums'], color: COLORS.textPrimary },
  emptyText: { fontSize: 14, color: COLORS.textMuted, paddingVertical: 12 },

  categoryIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    position: 'absolute',
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
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
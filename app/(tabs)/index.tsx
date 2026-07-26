import React, { useMemo, useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, Receipt } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTransactionStore } from '../../store/useTransactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { SwipeableRow } from '../../components/SwipeableRow';
import AddTransactionSheet from '../../components/AddTransactionSheet';
import { useUIStore } from '../../store/useUIStore';
import { useTabBarClearance } from './_layout';
import { BalanceCard } from '../../components/BalanceCard';

export default function Dashboard() {
  const recentTransactions = useTransactionStore((s) => s.recentTransactions);
  const userName = useUIStore((s) => s.userName);
  const avatar = useUIStore((s) => s.avatar);
  const bottomSheetRef = useRef<AddTransactionSheetHandle>(null);
  const tabBarClearance = useTabBarClearance();
  const notificationCount = useUIStore((s) => s.notificationCount);
  const router = useRouter();

  const openAddSheet = (type: 'income' | 'expense') => {
    bottomSheetRef.current?.open(type);
  };

  const topCategories = useMemo(() => {
    const totals: Record<string, { name: string; icon: string; color: string; total: number }> = {};
    recentTransactions.forEach((tx) => {
      if (tx.transaction_type !== 'expense') return;
      const key = tx.category_name || 'Other';
      if (!totals[key]) {
        totals[key] = {
          name: key,
          icon: tx.category_icon || 'Circle',
          color: tx.category_color || '#111827',
          total: 0,
        };
      }
      totals[key].total += Math.abs(tx.amount);
    });
    return Object.values(totals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [recentTransactions]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* ✅ Header moved OUTSIDE the BalanceCard for professional far-left/far-right alignment */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.avatarContainer, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => router.push('/profile')}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {(userName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>

          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi, {userName || 'there'}!</Text>
            <Text style={styles.greetingSub}>Here is your financial overview</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.bellButton, { transform: [{ scale: pressed ? 0.92 : 1 }] }]}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={22} color="#0F172A" strokeWidth={2.5} />
            {notificationCount > 0 && <View style={styles.bellDot} />}
          </Pressable>
        </View>

        <BalanceCard
          onAddExpense={() => openAddSheet('expense')}
          onAddIncome={() => openAddSheet('income')}
          topCategories={topCategories}
        />

        <View style={styles.transactionsPanel}>
          <View style={styles.transactionHeader}>
            <View>
              <Text style={styles.sectionTitleInner}>Recent Activity</Text>
              <Text style={styles.sectionSubtitle}>Your latest transactions</Text>
            </View>
            <Pressable
              onPress={() => router.push('/transactions')}
              hitSlop={12}
              style={({ pressed }) => [
                styles.searchButton,
                { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.92 : 1 }] }
              ]}
            >
              <Search size={18} color="#475569" strokeWidth={2.5} />
            </Pressable>
          </View>

          {recentTransactions.length ? (
            recentTransactions.map((tx) => (
              <SwipeableRow key={tx.id} transactionId={tx.id}>
                <TransactionItem transaction={tx} />
              </SwipeableRow>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconWrapper}>
                <Receipt size={32} color="#94A3B8" strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyText}>
                Add your first income or expense to start tracking your finances.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <AddTransactionSheet ref={bottomSheetRef} defaultType="expense" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // ✅ New Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  avatarContainer: {
    padding: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#475569',
    fontSize: 18,
    fontWeight: '700',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  greetingSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  transactionsPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 20,
    paddingTop: 28,
    paddingHorizontal: 24,
    minHeight: 320,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitleInner: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    paddingHorizontal: 24,
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
// app/(tabs)/index.tsx
import React, { useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import { BalanceCard } from '../../components/BalanceCard';
import { useRouter } from 'expo-router';
import { QuickActions } from '../../components/QuickActions';
import { useTransactionStore } from '../../store/useTransactionStore';
import { TransactionItem } from '../../components/TransactionItem';
import { SwipeableRow } from '../../components/SwipeableRow';
import AddTransactionSheet, { AddTransactionSheetHandle } from '../../components/AddTransactionSheet';
import { useUIStore } from '../../store/useUIStore';
import { useTabBarClearance } from './_layout';

export default function Dashboard() {
  const recentTransactions = useTransactionStore((s) => s.recentTransactions);
  const userName = useUIStore((s) => s.userName);
  const avatarUrl = useUIStore((s) => s.avatarUrl);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const bottomSheetRef = useRef<AddTransactionSheetHandle>(null);
  const tabBarClearance = useTabBarClearance();

  const router = useRouter();
  const openAddSheet = (type: 'income' | 'expense') => {
    bottomSheetRef.current?.open(type);
  };
  const notificationCount = useUIStore((s) => s.notificationCount);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.headerLeft, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => router.push('/profile')}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {(userName || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.greetingWrap}>
              <Text style={styles.greetingSmall}>{greeting}</Text>
              <Text style={styles.greetingName}>{userName || 'there'}</Text>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.bellButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={20} color="#111827" />
            {notificationCount > 0 ? (
              <View style={styles.bellCount}>
                <Text style={styles.bellCountText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            ) : (
              <View style={styles.bellDot} />
            )}
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>My Wallet</Text>
        <BalanceCard />

        <QuickActions
          onAddExpense={() => openAddSheet('expense')}
          onAddIncome={() => openAddSheet('income')}
        />

        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitleInner}>Transaction</Text>
          <Pressable onPress={() => router.push('/transactions')} hitSlop={8}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        {recentTransactions.length ? (
          recentTransactions.map((tx) => (
            <SwipeableRow key={tx.id} transactionId={tx.id}>
              <TransactionItem transaction={tx} />
            </SwipeableRow>
          ))
        ) : (
          <Text style={styles.emptyText}>No transactions yet. Add one to get started.</Text>
        )}
      </ScrollView>
      <AddTransactionSheet ref={bottomSheetRef} defaultType="expense" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 8,
  },
  scrollContent: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  greetingWrap: {
    marginRight: 4,
  },
  greetingSmall: {
    fontSize: 13,
    color: '#8A94A6',
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  bellCount: {
    position: 'absolute',
    top: 4,
    right: -4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  bellCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  sectionTitleInner: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8A94A6',
  },
  emptyText: {
    fontSize: 14,
    color: '#8A94A6',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    lineHeight: 20,
  },
});
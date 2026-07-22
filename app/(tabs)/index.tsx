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

export default function Dashboard() {
  const recentTransactions = useTransactionStore((s) => s.recentTransactions);
  const userName = useUIStore((s) => s.userName);
  const avatarUrl = useUIStore((s) => s.avatarUrl);
  const bottomSheetRef = useRef<AddTransactionSheetHandle>(null);

  const router = useRouter();
  const openAddSheet = (type: 'income' | 'expense') => {
    bottomSheetRef.current?.open(type);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{(userName || 'U').charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View>
              <Text style={styles.greetingSmall}>Good Morning</Text>
              <Text style={styles.greetingName}>{userName || 'there'}</Text>
            </View>
          </View>
          <Pressable style={styles.bellButton} onPress={() => router.push('/notifications')}>
            <Bell size={20} color="#111827" />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>My Wallet</Text>
        <BalanceCard />

        <QuickActions
          onAddExpense={() => openAddSheet('expense')}
          onAddIncome={() => openAddSheet('income')}
        />

        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitle}>Transaction</Text>
          <Text style={styles.viewAll}>View All</Text>
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
  container: { flex: 1, backgroundColor: '#F7F8FA', paddingTop: 8 },
  scrollContent: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  greetingSmall: { fontSize: 13, color: '#8A94A6', marginBottom: 2 },
  greetingName: { fontSize: 17, fontWeight: '700', color: '#111827' },
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
    top: 8,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
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
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  viewAll: { fontSize: 14, fontWeight: '500', color: '#8A94A6', paddingHorizontal: 16 },
  emptyText: {
    fontSize: 15,
    color: '#8A94A6',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
  },
});
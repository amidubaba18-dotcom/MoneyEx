import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionRow } from '../repositories/TransactionRepository';

interface TransactionStore {
    transactions: TransactionRow[];
    recentTransactions: TransactionRow[];
    addTransaction: (transaction: Omit<TransactionRow, 'id'> & { categoryName?: string; categoryIcon?: string; categoryColor?: string }) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;
    deleteTransactionsByRange: (startDate: Date, endDate: Date) => Promise<number>;
    resetAllTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>()(
    persist(
        (set, get) => ({
            transactions: [],
            recentTransactions: [],

            addTransaction: async (transaction) => {
                const newTx: TransactionRow = {
                    id: Date.now(),
                    ...transaction,
                    category_name: transaction.categoryName || transaction.category_name || null,
                    category_icon: transaction.categoryIcon || transaction.category_icon || null,
                    category_color: transaction.categoryColor || transaction.category_color || null,
                } as TransactionRow;

                set((state) => {
                    const updatedTransactions = [newTx, ...state.transactions];
                    const updatedRecent = updatedTransactions.slice(0, 10);
                    console.log('📥 Transaction added, total:', updatedTransactions.length);
                    return {
                        transactions: updatedTransactions,
                        recentTransactions: updatedRecent,
                    };
                });
            },

            deleteTransaction: async (id) => {
                console.log('🗑️ Deleting transaction:', id);
                set((state) => {
                    const updated = state.transactions.filter((t) => t.id !== id);
                    console.log('🗑️ Remaining transactions:', updated.length);
                    return {
                        transactions: updated,
                        recentTransactions: updated.slice(0, 10),
                    };
                });
            },

            deleteTransactionsByRange: async (startDate: Date, endDate: Date) => {
                console.log('🔍 deleteTransactionsByRange called');
                console.log('📅 Range:', startDate, 'to', endDate);
                
                const { transactions } = get();
                console.log('📊 Total transactions:', transactions.length);
                
                // Log each transaction's date for debugging
                transactions.forEach(t => {
                    console.log('📅 Transaction date:', t.transaction_date, 'parsed:', new Date(t.transaction_date));
                });
                
                const toDelete = transactions.filter(t => {
                    const d = new Date(t.transaction_date);
                    return d >= startDate && d <= endDate;
                });
                
                console.log('🎯 Transactions to delete:', toDelete.length);
                if (toDelete.length === 0) return 0;

                const idsToDelete = new Set(toDelete.map(t => t.id));
                console.log('🗑️ Deleting IDs:', [...idsToDelete]);
                
                set((state) => {
                    const remaining = state.transactions.filter(t => !idsToDelete.has(t.id));
                    console.log('✅ Remaining after deletion:', remaining.length);
                    return {
                        transactions: remaining,
                        recentTransactions: remaining.slice(0, 10),
                    };
                });
                return toDelete.length;
            },

            resetAllTransactions: async () => {
                console.log('🔄 Resetting ALL transactions...');
                set({ transactions: [], recentTransactions: [] });
                await AsyncStorage.removeItem('moneyex-transactions-storage');
                console.log('✅ All data reset complete.');
            },
        }),
        {
            name: 'moneyex-transactions-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

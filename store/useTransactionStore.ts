import { create } from 'zustand';
import { TransactionRepository, TransactionRow } from '../repositories/TransactionRepository';
import { dbEvents } from '../utils/EventEmitter';

const transactionRepo = new TransactionRepository();

interface TransactionState {
    transactions: TransactionRow[];
    recentTransactions: TransactionRow[];
    loading: boolean;
    subscribe: () => () => void;
    fetchAll: () => Promise<void>;
    fetchRecent: () => Promise<void>;
    addTransaction: (data: Parameters<typeof transactionRepo.create>[0]) => Promise<void>;
    deleteTransaction: (id: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    recentTransactions: [],
    loading: true,
    subscribe: () => {
        // Initial fetch
        get().fetchAll();
        get().fetchRecent();

        // Listen for DB changes
        const unsubscribe = dbEvents.on('transactions-changed', () => {
            get().fetchAll();
            get().fetchRecent();
        });

        return unsubscribe;
    },
    fetchAll: async () => {
        try {
            const transactions = await transactionRepo.getAll();
            set({ transactions, loading: false });
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    },
    fetchRecent: async () => {
        try {
            const recentTransactions = await transactionRepo.getRecent(5);
            set({ recentTransactions });
        } catch (error) {
            console.error('Failed to fetch recent transactions:', error);
        }
    },
    addTransaction: async (data) => {
        await transactionRepo.create(data);
        // The event will trigger re-fetch automatically
    },
    deleteTransaction: async (id) => {
        await transactionRepo.delete(id);
        // same
    },
}));
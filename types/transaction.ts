export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
    note?: string;
    createdAt: number;
    updatedAt: number;
}
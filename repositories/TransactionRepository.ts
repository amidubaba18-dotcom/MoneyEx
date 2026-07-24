import { getDatabase } from '../database';
import { dbEvents } from '../utils/EventEmitter';

export interface TransactionRow {
    id: number;
    amount: number;
    transaction_type: 'income' | 'expense';
    transaction_date: number;
    note: string | null;
    category_id: number | null;
    account_id: number | null;
    category_name?: string | null;
    category_color?: string | null;
    category_icon?: string | null;
}

export class TransactionRepository {
    // Fetch all transactions with category metadata
    getAll(): Promise<TransactionRow[]> {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT transactions.*, categories.name AS category_name, categories.color AS category_color, categories.icon AS category_icon
                     FROM transactions
                     LEFT JOIN categories ON categories.id = transactions.category_id
                     ORDER BY transaction_date DESC`,
                    [],
                    (_, result) => resolve(result.rows._array as TransactionRow[]),
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    // Fetch recent transactions for dashboard
    getRecent(limit: number = 5): Promise<TransactionRow[]> {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT transactions.*, categories.name AS category_name, categories.color AS category_color, categories.icon AS category_icon
                     FROM transactions
                     LEFT JOIN categories ON categories.id = transactions.category_id
                     ORDER BY transaction_date DESC LIMIT ?`,
                    [limit],
                    (_, result) => resolve(result.rows._array as TransactionRow[]),
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    // Create a transaction and emit 'transactions-changed'
    async create(data: {
        amount: number;
        type: 'income' | 'expense';
        categoryId: number;
        accountId: number;
        date: Date;
        note?: string;
    }): Promise<void> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO transactions (amount, transaction_type, transaction_date, note, category_id, account_id)
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        data.amount,
                        data.type,
                        data.date.getTime(),
                        data.note || null,
                        data.categoryId,
                        data.accountId,
                    ],
                    () => {
                        dbEvents.emit('transactions-changed');
                        resolve();
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    // Delete a transaction
    async delete(id: number): Promise<void> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM transactions WHERE id = ?',
                    [id],
                    () => {
                        dbEvents.emit('transactions-changed');
                        resolve();
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    // Delete all transactions (reset)
    async clearAll(): Promise<void> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM transactions',
                    [],
                    () => {
                        dbEvents.emit('transactions-changed');
                        resolve();
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    // Delete transactions in a specific month (month is 0-based JS month)
    async clearMonth(year: number, month: number): Promise<void> {
        const start = new Date(year, month, 1).getTime();
        const end = new Date(year, month + 1, 1).getTime();
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM transactions WHERE transaction_date >= ? AND transaction_date < ?',
                    [start, end],
                    () => {
                        dbEvents.emit('transactions-changed');
                        resolve();
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    // ... update, etc.
}
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

const STORAGE_KEY = 'moneyex_web_db_v1';

interface WebDBState {
    accounts: any[];
    categories: any[];
    transactions: any[];
    budgets: any[];
    nextIds: { [table: string]: number };
}

interface WebSqlResult {
    rows: {
        length: number;
        item: (index: number) => any;
        _array: any[];
    };
}

interface WebSqlTransaction {
    executeSql: (
        sql: string,
        params?: any[],
        success?: (tx: WebSqlTransaction, result: WebSqlResult) => void,
        error?: (tx: WebSqlTransaction, err: any) => boolean
    ) => void;
}

type NativeDB = SQLite.WebSQLDatabase;

type Database = NativeDB | { transaction: (fn: (tx: WebSqlTransaction) => void) => void };

let db: Database;

export function getDatabase() {
    if (!db) {
        if (Platform.OS === 'web') {
            db = createWebDatabase();
            initializeDatabase();
        } else {
            db = SQLite.openDatabase('moneyex.db');
            initializeDatabase();
        }
    }
    return db;
}

function createWebDatabase(): { transaction: (fn: (tx: WebSqlTransaction) => void) => void } {
    const state = loadWebState();

    const saveState = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn('Unable to save web DB state', error);
        }
    };

    const makeResult = (rows: any[]): WebSqlResult => ({
        rows: {
            length: rows.length,
            item: (index: number) => rows[index],
            _array: rows,
        },
    });

    const transaction = (fn: (tx: WebSqlTransaction) => void) => {
        const tx: WebSqlTransaction = {
            executeSql: (sql, params = [], success, error) => {
                try {
                    const normalized = sql.trim().replace(/\s+/g, ' ').toLowerCase();
                    let result: WebSqlResult = makeResult([]);

                    if (normalized.startsWith('create table')) {
                        result = makeResult([]);
                    } else if (normalized.startsWith('select count(*) as count from categories')) {
                        result = makeResult([{ count: state.categories.length }]);
                    } else if (normalized.startsWith('select count(*) as count from accounts')) {
                        result = makeResult([{ count: state.accounts.length }]);
                    } else if (normalized.startsWith('select * from categories where type = ?')) {
                        result = makeResult(state.categories.filter((row) => row.type === params[0]));
                    } else if (normalized.startsWith('select * from categories where id = ? limit 1')) {
                        const row = state.categories.find((row) => row.id === params[0]);
                        result = makeResult(row ? [row] : []);
                    } else if (normalized.startsWith('select * from categories')) {
                        result = makeResult(state.categories);
                    } else if (normalized.startsWith('select * from accounts limit 1')) {
                        result = makeResult(state.accounts.slice(0, 1));
                    } else if (normalized.startsWith('select transactions.*, categories.name as category_name')) {
                        const rows = state.transactions
                            .map((txRow) => {
                                const cat = state.categories.find((catRow) => catRow.id === txRow.category_id);
                                return {
                                    ...txRow,
                                    category_name: cat?.name || null,
                                    category_color: cat?.color || null,
                                    category_icon: cat?.icon || null,
                                };
                            })
                            .sort((a, b) => b.transaction_date - a.transaction_date);
                        if (normalized.includes('limit ?')) {
                            const limit = params[0];
                            result = makeResult(rows.slice(0, limit));
                        } else {
                            result = makeResult(rows);
                        }
                    } else if (normalized.startsWith('insert into categories')) {
                        const [name, icon, color, type] = params;
                        const row = { id: state.nextIds.categories++, name, icon, color, type, is_default: 0 };
                        state.categories.push(row);
                        saveState();
                        result = makeResult([]);
                    } else if (normalized.startsWith('insert into accounts')) {
                        const [name, balance, color, icon, type] = params;
                        const row = { id: state.nextIds.accounts++, name, balance, color, icon, type };
                        state.accounts.push(row);
                        saveState();
                        result = makeResult([]);
                    } else if (normalized.startsWith('insert into transactions')) {
                        const [amount, transaction_type, transaction_date, note, category_id, account_id] = params;
                        const row = {
                            id: state.nextIds.transactions++,
                            amount,
                            transaction_type,
                            transaction_date,
                            note,
                            category_id,
                            account_id,
                        };
                        state.transactions.push(row);
                        saveState();
                        result = makeResult([]);
                    } else if (normalized.startsWith('delete from transactions where id = ?')) {
                        const id = params[0];
                        state.transactions = state.transactions.filter((row) => row.id !== id);
                        saveState();
                        result = makeResult([]);
                    } else if (normalized === 'delete from transactions') {
                        state.transactions = [];
                        saveState();
                        result = makeResult([]);
                    } else if (normalized.startsWith('delete from transactions where transaction_date')) {
                        // Handle 'DELETE FROM transactions WHERE transaction_date >= ? AND transaction_date < ?'
                        const paramsVals = params;
                        if (paramsVals && paramsVals.length >= 2) {
                            const start = paramsVals[0];
                            const end = paramsVals[1];
                            state.transactions = state.transactions.filter((row) => !(row.transaction_date >= start && row.transaction_date < end));
                            saveState();
                            result = makeResult([]);
                        } else {
                            result = makeResult([]);
                        }
                    } else if (normalized.startsWith('update accounts set balance')) {
                        // Support updating all account balances (e.g., 'UPDATE accounts SET balance = 0')
                        const match = sql.match(/set\s+balance\s*=\s*\?/i);
                        if (match && params.length > 0) {
                            const newVal = params[0];
                            state.accounts = state.accounts.map((a) => ({ ...a, balance: newVal }));
                        } else {
                            // handle literal number in SQL
                            const m2 = sql.match(/set\s+balance\s*=\s*(\d+(?:\.\d+)?)/i);
                            if (m2) {
                                const val = Number(m2[1]);
                                state.accounts = state.accounts.map((a) => ({ ...a, balance: val }));
                            }
                        }
                        saveState();
                        result = makeResult([]);
                    } else {
                        console.warn('Web SQL fallback does not support query:', sql);
                        result = makeResult([]);
                    }

                    success?.(tx, result);
                } catch (err) {
                    if (error) {
                        error(tx, err);
                    } else {
                        console.error(err);
                    }
                }
            },
        };
        fn(tx);
    };

    return { transaction };
}

function loadWebState(): WebDBState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (error) {
        console.warn('Unable to load web DB state', error);
    }

    return {
        accounts: [],
        categories: [],
        transactions: [],
        budgets: [],
        nextIds: {
            accounts: 1,
            categories: 1,
            transactions: 1,
            budgets: 1,
        },
    };
}

function initializeDatabase() {
    const database = getDatabase();

    if (Platform.OS === 'web') {
        seedDefaults();
        return;
    }

    database.transaction(
        (tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        balance REAL NOT NULL DEFAULT 0,
        color TEXT,
        icon TEXT,
        type TEXT
      );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        type TEXT NOT NULL,
        is_default INTEGER DEFAULT 1
      );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        transaction_type TEXT NOT NULL,
        transaction_date INTEGER NOT NULL,
        note TEXT,
        category_id INTEGER,
        account_id INTEGER,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      );`
            );
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        month TEXT NOT NULL,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );`
            );
        },
        (error) => {
            console.log('DB init error:', error);
        },
        () => {
            seedDefaults();
        }
    );
}

function seedDefaults() {
    const database = getDatabase();
    database.transaction((tx) => {
        tx.executeSql('SELECT COUNT(*) as count FROM categories', [], (_, result) => {
            if (result.rows.item(0).count === 0) {
                seedDefaultCategories(tx);
            }
        });
        tx.executeSql('SELECT COUNT(*) as count FROM accounts', [], (_, result) => {
            if (result.rows.item(0).count === 0) {
                seedDefaultAccount(tx);
            }
        });
    });
}

function seedDefaultCategories(tx: WebSqlTransaction | SQLite.SQLTransaction) {
    const expenseCats = [
        ['Food & Drinks', 'UtensilsCrossed', '#FF6B6B', 'expense'],
        ['Transport', 'Car', '#4ECDC4', 'expense'],
        ['Shopping', 'ShoppingBag', '#FFD166', 'expense'],
        ['Utilities', 'Wrench', '#A29BFE', 'expense'],
        ['Bills', 'FileText', '#6C5CE7', 'expense'],
    ];
    const incomeCats = [
        ['Salary', 'Briefcase', '#2ECC71', 'income'],
        ['Freelance', 'Laptop', '#1ABC9C', 'income'],
        ['Investments', 'TrendingUp', '#3498DB', 'income'],
    ];
    const all = [...expenseCats, ...incomeCats];
    all.forEach((cat) => {
        tx.executeSql('INSERT INTO categories (name, icon, color, type) VALUES (?, ?, ?, ?)', [cat[0], cat[1], cat[2], cat[3]]);
    });
}

function seedDefaultAccount(tx: WebSqlTransaction | SQLite.SQLTransaction) {
    tx.executeSql(
        'INSERT INTO accounts (name, balance, color, icon, type) VALUES (?, ?, ?, ?, ?)',
        ['Cash', 0, '#4F46E5', 'Wallet', 'checking']
    );
}
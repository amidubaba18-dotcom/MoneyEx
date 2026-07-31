import { getDatabase } from '../database';

export interface AccountRow {
    id: number;
    name: string;
    balance: number;
    color: string;
    icon: string;
    type: string;
}

export class AccountRepository {
    getDefault(): Promise<AccountRow | null> {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM accounts LIMIT 1',
                    [],
                    (_, result) => resolve(result.rows.length ? (result.rows.item(0) as AccountRow) : null),
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }

    async resetBalances(): Promise<void> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE accounts SET balance = 0',
                    [],
                    () => {
                        resolve();
                    },
                    (_, error) => { reject(error); return false; }
                );
            });
        });
    }
}

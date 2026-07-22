import { getDatabase } from '../database';

export interface CategoryRow {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense';
    is_default: number;
}

export class CategoryRepository {
    async getAll(): Promise<CategoryRow[]> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM categories',
                    [],
                    (_, result) => {
                        const rows: CategoryRow[] = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            rows.push(result.rows.item(i) as CategoryRow);
                        }
                        resolve(rows);
                    },
                    (_, error) => {
                        reject(error);
                        return false;
                    }
                );
            });
        });
    }

    async getByType(type: 'income' | 'expense'): Promise<CategoryRow[]> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM categories WHERE type = ?',
                    [type],
                    (_, result) => {
                        const rows: CategoryRow[] = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            rows.push(result.rows.item(i) as CategoryRow);
                        }
                        resolve(rows);
                    },
                    (_, error) => {
                        reject(error);
                        return false;
                    }
                );
            });
        });
    }

    async getById(id: number): Promise<CategoryRow | null> {
        const db = getDatabase();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM categories WHERE id = ? LIMIT 1',
                    [id],
                    (_, result) => resolve(result.rows.length ? (result.rows.item(0) as CategoryRow) : null),
                    (_, error) => {
                        reject(error);
                        return false;
                    }
                );
            });
        });
    }
}
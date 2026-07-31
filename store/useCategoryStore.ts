import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CategoryItem {
    id: string;
    name: string;
    icon: string; // key into ICON_LIBRARY (see utils/categoryIcons.tsx)
    color: string;
    isCustom: boolean;
}

const STORAGE_KEY = 'moneyex.customCategories';

// The built-in set — same categories that were previously hardcoded directly
// into AddExpenseScreen. Not user-editable/deletable, only extendable.
export const DEFAULT_CATEGORIES: CategoryItem[] = [
    { id: 'food', name: 'Food', icon: 'Utensils', color: '#EF4444', isCustom: false },
    { id: 'groceries', name: 'Groceries', icon: 'ShoppingBag', color: '#22C55E', isCustom: false },
    { id: 'transport', name: 'Transport', icon: 'Car', color: '#3B82F6', isCustom: false },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', color: '#8B5CF6', isCustom: false },
    { id: 'bills', name: 'Bills', icon: 'FileText', color: '#F59E0B', isCustom: false },
    { id: 'fun', name: 'Fun', icon: 'Film', color: '#EC4899', isCustom: false },
    { id: 'health', name: 'Health', icon: 'Heart', color: '#14B8A6', isCustom: false },
    { id: 'travel', name: 'Travel', icon: 'Plane', color: '#06B6D4', isCustom: false },
    { id: 'home', name: 'Home', icon: 'Home', color: '#F97316', isCustom: false },
    { id: 'school', name: 'School', icon: 'BookOpen', color: '#6366F1', isCustom: false },
    { id: 'personal', name: 'Personal', icon: 'User', color: '#F43F5E', isCustom: false },
];

interface CategoryState {
    customCategories: CategoryItem[];
    addCategory: (cat: Omit<CategoryItem, 'id' | 'isCustom'>) => void;
    removeCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    customCategories: [],
    addCategory: (cat) => {
        const newCat: CategoryItem = { ...cat, id: `custom_${Date.now()}`, isCustom: true };
        const next = [...get().customCategories, newCat];
        set({ customCategories: next });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    },
    removeCategory: (id) => {
        const next = get().customCategories.filter((c) => c.id !== id);
        set({ customCategories: next });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    },
}));

// Hydrate persisted custom categories once on app load.
AsyncStorage.getItem(STORAGE_KEY)
    .then((saved) => {
        if (saved) {
            try {
                useCategoryStore.setState({ customCategories: JSON.parse(saved) });
            } catch {
                // corrupted storage — ignore, keep defaults only
            }
        }
    })
    .catch(() => {});

// Convenience hook: defaults + custom, combined — what the category grid
// (Settings, and eventually AddExpenseScreen) should actually render.
export const useAllCategories = (): CategoryItem[] => {
    const custom = useCategoryStore((s) => s.customCategories);
    return [...DEFAULT_CATEGORIES, ...custom];
};

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CategoryItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    isCustom: boolean;
}

const STORAGE_KEY = 'moneyex.customCategories';

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
    isHydrated: boolean;
    addCategory: (cat: Omit<CategoryItem, 'id' | 'isCustom'>) => void;
    removeCategory: (id: string) => void;
}

// Tracks whether the user has mutated the store before hydration finished,
// so the async storage read never overwrites a fresher in-memory add.
let hasLocalChanges = false;

export const useCategoryStore = create<CategoryState>((set, get) => ({
    customCategories: [],
    isHydrated: false,
    addCategory: (cat) => {
        hasLocalChanges = true;
        const newCat: CategoryItem = { ...cat, id: `custom_${Date.now()}`, isCustom: true };
        const next = [...get().customCategories, newCat];
        set({ customCategories: next });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((err) => {
            console.error('Failed to persist category:', err);
        });
    },
    removeCategory: (id) => {
        hasLocalChanges = true;
        const next = get().customCategories.filter((c) => c.id !== id);
        set({ customCategories: next });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((err) => {
            console.error('Failed to persist category removal:', err);
        });
    },
}));

// Hydrate persisted custom categories once on app load — but never stomp
// on a category the user already added while this read was in flight.
AsyncStorage.getItem(STORAGE_KEY)
    .then((saved) => {
        if (saved && !hasLocalChanges) {
            try {
                useCategoryStore.setState({ customCategories: JSON.parse(saved), isHydrated: true });
                return;
            } catch (err) {
                console.error('Corrupted category storage, ignoring:', err);
            }
        }
        useCategoryStore.setState({ isHydrated: true });
    })
    .catch((err) => {
        console.error('Failed to read category storage:', err);
        useCategoryStore.setState({ isHydrated: true });
    });

export const useAllCategories = (): CategoryItem[] => {
    const custom = useCategoryStore((s) => s.customCategories);
    return [...DEFAULT_CATEGORIES, ...custom];
};
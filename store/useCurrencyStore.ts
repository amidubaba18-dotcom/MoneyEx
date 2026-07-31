import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Global currency selection. formatCurrency() reads useCurrencyStore.getState()
// directly (not a hook) so it can be called from anywhere, not just components.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'moneyex.currency';

interface CurrencyState {
    code: string; // ISO 4217, e.g. 'GHS'
    setCurrency: (code: string) => void;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
    code: 'GHS',
    setCurrency: (code) => {
        set({ code });
        AsyncStorage.setItem(STORAGE_KEY, code).catch(() => {});
    },
}));

// Hydrate the persisted choice once on app load.
AsyncStorage.getItem(STORAGE_KEY)
    .then((saved) => {
        if (saved) useCurrencyStore.setState({ code: saved });
    })
    .catch(() => {});

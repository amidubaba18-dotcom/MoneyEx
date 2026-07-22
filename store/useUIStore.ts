import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UIState {
    isDarkMode: boolean;
    toggleTheme: () => void;
    selectedMonth: string; // 'YYYY-MM'
    setSelectedMonth: (month: string) => void;
    userName: string;
    setUserName: (name: string) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isDarkMode: false,
            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            selectedMonth: new Date().toISOString().slice(0, 7),
            setSelectedMonth: (month) => set({ selectedMonth: month }),
            userName: 'Baba',
            setUserName: (name) => set({ userName: name }),
        }),
        {
            name: 'ui-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
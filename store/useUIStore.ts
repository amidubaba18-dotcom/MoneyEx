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
    // notification preferences
    notificationPrefs: {
        enabled: boolean;
        type: 'daily' | 'weekly' | 'monthly' | null;
        time?: string; // HH:MM
        weekday?: number; // 1-7
        dayOfMonth?: number; // 1-31
        scheduledId?: string | null;
    };
    setNotificationPrefs: (p: Partial<UIState['notificationPrefs']>) => void;
    notificationCount: number;
    setNotificationCount: (n: number) => void;
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
            notificationPrefs: { enabled: false, type: null, time: '08:00', weekday: 1, dayOfMonth: 1, scheduledId: null },
            setNotificationPrefs: (p) => set((state) => ({ notificationPrefs: { ...state.notificationPrefs, ...p } })),
            notificationCount: 0,
            setNotificationCount: (n: number) => set({ notificationCount: n }),
        }),
        {
            name: 'ui-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface NotificationSettings {
    enabled: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    transactionAlerts: boolean;
    budgetAlerts: boolean;
}

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    data?: any;
}

interface UIState {
    userName: string;
    avatar: string | null;
    notificationCount: number;
    notifications: Notification[];
    notificationSettings: NotificationSettings;
    themeMode: ThemeMode;
    language: string;
    setUserName: (name: string) => void;
    setAvatar: (uri: string | null) => void;
    setNotificationCount: (count: number) => void;
    setNotifications: (notifications: Notification[]) => void;
    markNotificationAsRead: (id: string) => void;
    markAllAsRead: () => void;
    updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
    setThemeMode: (mode: ThemeMode) => void;
    setLanguage: (lang: string) => void;
}

const defaultSettings: NotificationSettings = {
    enabled: true,
    weeklyReport: true,
    monthlyReport: true,
    transactionAlerts: true,
    budgetAlerts: true,
};

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            userName: 'User',
            avatar: null,
            notificationCount: 0,
            notifications: [],
            notificationSettings: defaultSettings,
            themeMode: 'system',
            language: 'en',

            setUserName: (name) => set({ userName: name }),
            setAvatar: (uri) => set({ avatar: uri }),
            setNotificationCount: (count) => set({ notificationCount: count }),
            setNotifications: (notifications) => set({ notifications }),
            markNotificationAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    notificationCount: Math.max(0, state.notificationCount - 1),
                })),
            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    notificationCount: 0,
                })),
            updateNotificationSettings: (settings) =>
                set((state) => ({
                    notificationSettings: { ...state.notificationSettings, ...settings },
                })),
            setThemeMode: (mode) => set({ themeMode: mode }),
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'moneyex-ui-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

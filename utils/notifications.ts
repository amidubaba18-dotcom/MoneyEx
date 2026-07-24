// Lightweight notifications helper that uses dynamic imports so web bundlers
// don't try to resolve native-only modules like `expo-notifications` / `expo-device`.

export type NotifyType = 'daily' | 'weekly' | 'monthly';

async function loadNotifications(): Promise<any | null> {
    try {
        return await import('expo-notifications');
    } catch (e) {
        return null;
    }
}

async function loadDevice(): Promise<any | null> {
    try {
        return await import('expo-device');
    } catch (e) {
        return null;
    }
}

export async function requestPermissions() {
    const Device = await loadDevice();
    if (!Device || !Device.isDevice) return { granted: false };
    const Notifications = await loadNotifications();
    if (!Notifications) return { granted: false };
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return { granted: true };
    const { status } = await Notifications.requestPermissionsAsync();
    return { granted: status === 'granted' };
}

export async function scheduleSummaryNotification(idTag: string, type: NotifyType, time: { hour: number; minute: number }, options?: { weekday?: number; day?: number }) {
    const Notifications = await loadNotifications();
    if (!Notifications) throw new Error('Notifications not available on this platform');

    let trigger: any = null;
    if (type === 'daily') {
        trigger = { hour: time.hour, minute: time.minute, repeats: true };
    } else if (type === 'weekly') {
        trigger = { weekday: options?.weekday || 1, hour: time.hour, minute: time.minute, repeats: true };
    } else if (type === 'monthly') {
        const day = options?.day || 1;
        try {
            const now = new Date();
            const next = new Date(now.getFullYear(), now.getMonth(), day, time.hour, time.minute, 0);
            trigger = { date: next, repeats: true };
        } catch (e) {
            trigger = { hour: time.hour, minute: time.minute, repeats: true };
        }
    }

    const localId = await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Spending summary',
            body: 'Tap to view your recent spending summary.',
            data: { type: 'summary', period: type },
        },
        trigger,
    });
    return localId;
}

export async function cancelNotification(id: string) {
    const Notifications = await loadNotifications();
    if (!Notifications) return;
    try {
        await Notifications.cancelScheduledNotificationAsync(id);
    } catch (e) {
        console.warn('Cancel failed', e);
    }
}

export async function cancelAllNotifications() {
    const Notifications = await loadNotifications();
    if (!Notifications) return;
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {
        console.warn('Cancel all failed', e);
    }
}

export async function presentImmediateSummary(body: string) {
    const Notifications = await loadNotifications();
    if (!Notifications) return;
    await Notifications.scheduleNotificationAsync({
        content: { title: 'Spending summary', body, data: { type: 'summary-now' } },
        trigger: null,
    });
}

export default {
    requestPermissions,
    scheduleSummaryNotification,
    cancelNotification,
    cancelAllNotifications,
    presentImmediateSummary,
};

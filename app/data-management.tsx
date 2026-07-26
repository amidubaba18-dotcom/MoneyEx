import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, CalendarDays, Trash2, AlertTriangle, ChevronRight, X } from 'lucide-react-native';
import { useThemeMode } from '../context/ThemeContext';
import { useTransactionStore } from '../store/useTransactionStore';

type ResetOption = {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
    color: string;
    action: () => void;
};

export default function DataManagementScreen() {
    const router = useRouter();
    const { isDark } = useThemeMode();
    const transactions = useTransactionStore((s) => s.transactions);
    const deleteTransactionsByRange = useTransactionStore((s) => s.deleteTransactionsByRange);
    const resetAllTransactions = useTransactionStore((s) => s.resetAllTransactions);

    const [modalVisible, setModalVisible] = useState(false);
    const [pendingReset, setPendingReset] = useState<{
        label: string;
        count: number;
        startDate: Date;
        endDate: Date;
        isAll: boolean;
    } | null>(null);

    console.log('📊 DataManagement: transactions count =', transactions.length);

    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };
    const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

    const countForRange = (startDate: Date, endDate: Date) => {
        return transactions.filter(t => {
            const d = new Date(t.transaction_date);
            return d >= startDate && d <= endDate;
        }).length;
    };

    const showResetModal = (label: string, startDate: Date, endDate: Date, isAll: boolean = false) => {
        const count = countForRange(startDate, endDate);
        if (count === 0) {
            alert(`No transactions found for ${label}.`);
            return;
        }
        setPendingReset({ label, count, startDate, endDate, isAll });
        setModalVisible(true);
    };

    const confirmReset = async () => {
        if (!pendingReset) return;
        const { label, startDate, endDate, isAll, count } = pendingReset;
        setModalVisible(false);

        try {
            console.log(`🗑️ Deleting ${label} transactions...`);
            let deleted = 0;
            if (isAll) {
                await resetAllTransactions();
                deleted = count;
            } else {
                deleted = await deleteTransactionsByRange(startDate, endDate);
            }
            console.log(`✅ Deleted ${deleted} transactions`);
            // Show success alert with "Go Back" button
            alert(`${deleted} transaction(s) deleted.`);
            // After reset, go back to profile
            router.replace('/profile');
        } catch (error) {
            console.error('❌ Reset error:', error);
            alert('Something went wrong.');
        }
        setPendingReset(null);
    };

    const resetToday = () => {
        const now = new Date();
        showResetModal('Today', startOfDay(now), now);
    };

    const resetThisWeek = () => {
        const now = new Date();
        showResetModal('This Week', startOfWeek(now), now);
    };

    const resetThisMonth = () => {
        const now = new Date();
        showResetModal('This Month', startOfMonth(now), now);
    };

    const resetAll = () => {
        const count = transactions.length;
        if (count === 0) {
            alert('No transactions to delete.');
            return;
        }
        setPendingReset({
            label: 'All Data',
            count,
            startDate: new Date(0),
            endDate: new Date(),
            isAll: true,
        });
        setModalVisible(true);
    };

    const resetOptions: ResetOption[] = [
        {
            id: 'today',
            title: 'Today',
            description: 'Delete transactions from today',
            icon: Clock,
            color: '#3B82F6',
            action: resetToday,
        },
        {
            id: 'week',
            title: 'This Week',
            description: 'Delete transactions from this week',
            icon: CalendarDays,
            color: '#8B5CF6',
            action: resetThisWeek,
        },
        {
            id: 'month',
            title: 'This Month',
            description: 'Delete transactions from this month',
            icon: Calendar,
            color: '#F59E0B',
            action: resetThisMonth,
        },
        {
            id: 'all',
            title: 'All Data',
            description: 'Delete ALL transactions permanently',
            icon: Trash2,
            color: '#EF4444',
            action: resetAll,
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/profile')}>
                    <ArrowLeft size={20} color={isDark ? '#F1F5F9' : '#0F172A'} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>Data Management</Text>
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                    Choose a time range to reset your transactions.
                </Text>

                <View style={styles.optionsContainer}>
                    {resetOptions.map((option) => {
                        const Icon = option.icon;
                        let count = 0;
                        const now = new Date();
                        switch (option.id) {
                            case 'today':
                                count = countForRange(startOfDay(now), now);
                                break;
                            case 'week':
                                count = countForRange(startOfWeek(now), now);
                                break;
                            case 'month':
                                count = countForRange(startOfMonth(now), now);
                                break;
                            case 'all':
                                count = transactions.length;
                                break;
                        }
                        return (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.7}
                                style={[
                                    styles.optionCard,
                                    { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
                                    option.id === 'all' && styles.dangerCard,
                                ]}
                                onPress={option.action}
                            >
                                <View style={[styles.iconWrap, { backgroundColor: option.color + '20' }]}>
                                    <Icon size={22} color={option.color} strokeWidth={2.5} />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={[styles.optionTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                        {option.title}
                                    </Text>
                                    <Text style={[styles.optionDescription, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                                        {option.description}
                                    </Text>
                                </View>
                                <View style={styles.rightSection}>
                                    <Text style={[styles.badge, { color: option.color }]}>
                                        {count}
                                    </Text>
                                    <ChevronRight size={18} color={isDark ? '#64748B' : '#94A3B8'} strokeWidth={2} />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.footer}>
                    <AlertTriangle size={20} color={isDark ? '#94A3B8' : '#94A3B8'} strokeWidth={2} />
                    <Text style={[styles.footerText, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                        Resets are permanent and cannot be undone.
                    </Text>
                </View>
            </View>

            {/* Custom Confirmation Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                Reset {pendingReset?.label || ''}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color={isDark ? '#94A3B8' : '#64748B'} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.modalMessage, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                            This will delete {pendingReset?.count || 0} transaction(s). This cannot be undone.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalDelete]}
                                onPress={confirmReset}
                            >
                                <Text style={styles.modalDeleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
    subtitle: { fontSize: 14, fontWeight: '400', marginBottom: 24 },
    optionsContainer: { gap: 12 },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    dangerCard: {
        borderColor: '#FEE2E2',
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionText: { flex: 1 },
    optionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    optionDescription: { fontSize: 13, fontWeight: '400' },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        fontSize: 14,
        fontWeight: '700',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
        minWidth: 30,
        textAlign: 'center',
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    footerText: { fontSize: 13, fontWeight: '400', textAlign: 'center' },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    modalMessage: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalCancel: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    modalCancelText: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '600',
    },
    modalDelete: {
        backgroundColor: '#EF4444',
    },
    modalDeleteText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

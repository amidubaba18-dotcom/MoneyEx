import React, { useState, useCallback, useMemo } from 'react';
import { useAppColors } from '../theme';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import * as Haptics from 'expo-haptics';

import DateTimePicker from '@react-native-community/datetimepicker';
// NOTE: @react-native-community/datetimepicker has no web implementation.
// Rendering it on web crashes with an unrelated-looking DOM error
// ("Failed to construct 'Text'...") because Metro bundles its native-only
// internals for the web target. We guard all usage behind Platform.OS.
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

import { X, Calendar, Clock } from 'lucide-react-native';
import { useTransactionStore } from '../store/useTransactionStore';

import { useDefaultAccount } from '../hooks/useDefaultAccount';

import { useAllCategories } from '../store/useCategoryStore';

import { getIcon } from '../utils/categoryIcons';

import { CURRENCIES } from '../utils/currencies';

import { useCurrencyStore } from '../store/useCurrencyStore';

interface AddExpenseSheetProps {
    defaultType?: 'income' | 'expense';
}

const fontFamily = Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' });

export default function AddExpenseSheet({ defaultType = 'expense' }: AddExpenseSheetProps) {
    const router = useRouter();
    const colors = useAppColors();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const allCategories = useAllCategories();
    const currencyCode = useCurrencyStore((s) => s.code);
    const currencySymbol = CURRENCIES.find((c) => c.code === currencyCode)?.symbol || '₵';

    const [type] = useState<'income' | 'expense'>(defaultType);
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<typeof allCategories[0] | null>(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const addTransaction = useTransactionStore((s) => s.addTransaction);
    const defaultAccount = useDefaultAccount();

    const close = useCallback(() => router.back(), [router]);

    const handleSave = useCallback(async () => {
        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0 || !defaultAccount) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const category = selectedCategory || {
            id: 'uncategorized',
            name: 'Other',
            icon: 'Circle',
            color: colors.textMuted,
        };

        await addTransaction({
            amount: value,
            transaction_type: type,
            transaction_date: date.getTime(),
            note: null,
            category_id: null,
            account_id: defaultAccount.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
        });
        close();
    }, [amount, type, selectedCategory, date, defaultAccount, addTransaction, close, colors.textMuted]);

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const pickerDisplay = Platform.OS === 'ios' ? 'compact' : 'default';

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(date);
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setDate(newDate);
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
            setDate(newDate);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.flexFill}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Add {type === 'expense' ? 'expense' : 'income'}</Text>
                    <TouchableOpacity
                        onPress={close}
                        hitSlop={12}
                        style={styles.closeButton}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                    >
                        <X size={22} color={colors.textPrimary} strokeWidth={2.25} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.flexFill}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.heroSection}>
                        <View style={styles.amountRow}>
                            <Text style={styles.currencySymbol}>{currencySymbol}</Text>
                            <TextInput
                                style={styles.heroAmountInput}
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0.00"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="decimal-pad"
                                autoFocus
                                selectionColor={colors.textPrimary}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <View style={styles.categoryGrid}>
                            {allCategories.map((cat) => {
                                const Icon = getIcon(cat.icon);
                                const isSelected = selectedCategory?.id === cat.id;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                                        onPress={() => setSelectedCategory(cat)}
                                        activeOpacity={0.7}
                                        accessibilityRole="button"
                                        accessibilityLabel={cat.name}
                                    >
                                        <View style={[styles.categoryBadge, { backgroundColor: `${cat.color}26` }]}>
                                            <Icon size={18} color={cat.color} strokeWidth={2.25} />
                                        </View>
                                        <Text style={styles.categoryLabel} numberOfLines={1}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>When</Text>
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.whenButton}
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="Change date"
                            >
                                <Calendar size={18} color={colors.textMuted} strokeWidth={2} />
                                <Text style={styles.rowLabel}>{formatDate(date)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.whenButton}
                                onPress={() => setShowTimePicker(true)}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel="Change time"
                            >
                                <Clock size={18} color={colors.textMuted} strokeWidth={2} />
                                <Text style={styles.rowLabel}>{formatTime(date)}</Text>
                            </TouchableOpacity>
                        </View>
                        {isNative && showDatePicker && (
                            <DateTimePicker value={date} mode="date" display={pickerDisplay} onChange={onDateChange} />
                        )}
                        {isNative && showTimePicker && (
                            <DateTimePicker value={date} mode="time" display={pickerDisplay} onChange={onTimeChange} />
                        )}
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={[styles.saveButton, !amount && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!amount}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${type === 'expense' ? 'expense' : 'income'}`}
                >
                    <Text style={styles.saveButtonText}>Add {type === 'expense' ? 'expense' : 'income'}</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ReturnType<typeof useAppColors>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    flexFill: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        marginBottom: 8,
    },
    title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, fontFamily },
    closeButton: { padding: 4 },

    scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },

    heroSection: { marginTop: 20, marginBottom: 32, alignItems: 'center', justifyContent: 'center', width: '100%' },
    amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
    currencySymbol: { fontSize: 24, fontWeight: '600', color: colors.textMuted, marginRight: 8, fontFamily },
    heroAmountInput: {
        fontSize: 44, fontWeight: '700', color: colors.textPrimary,
        letterSpacing: -0.5, fontVariant: ['tabular-nums'],
        padding: 0, margin: 0, borderWidth: 0, backgroundColor: 'transparent',
        fontFamily, minWidth: 60,
        ...Platform.select({ web: { outlineStyle: 'none' } }),
    },

    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3, color: colors.textMuted, marginBottom: 12, fontFamily },

    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    categoryItem: { width: '22%', alignItems: 'center', gap: 6, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: 'transparent' },
    categoryItemSelected: { borderColor: colors.accent, backgroundColor: 'rgba(242,242,240,0.05)' },
    categoryBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    categoryLabel: { fontSize: 12, color: colors.textPrimary, textAlign: 'center', fontWeight: '500', fontFamily },

    row: { flexDirection: 'row', gap: 12 },
    whenButton: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingVertical: 14, paddingHorizontal: 16, flex: 1,
        borderRadius: 14, borderWidth: 1, borderColor: colors.hairline,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    rowLabel: { fontSize: 15, fontWeight: '500', color: colors.textPrimary, fontFamily },

    saveButton: {
        marginHorizontal: 24, marginBottom: 16,
        backgroundColor: colors.accent, borderRadius: 18, paddingVertical: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    saveButtonDisabled: { backgroundColor: 'rgba(242,242,240,0.15)' },
    saveButtonText: { fontSize: 17, fontWeight: '700', color: colors.bg, letterSpacing: 0.3, fontFamily },
});
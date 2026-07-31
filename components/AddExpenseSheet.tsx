import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar, Clock, Utensils, ShoppingBag, Car, ShoppingCart, FileText, Film, Heart, Plane, Home, BookOpen, User, Circle } from 'lucide-react-native';
import { useTransactionStore } from '../store/useTransactionStore';
import { useDefaultAccount } from '../hooks/useDefaultAccount';

// ---------------------------------------------------------------------------
// Hardcoded categories to avoid any import issues – we can make dynamic later
// ---------------------------------------------------------------------------
const CATEGORIES = [
    { id: 1, name: 'Food', icon: Utensils, color: '#EF4444' },
    { id: 2, name: 'Groceries', icon: ShoppingBag, color: '#22C55E' },
    { id: 3, name: 'Transport', icon: Car, color: '#3B82F6' },
    { id: 4, name: 'Shopping', icon: ShoppingCart, color: '#8B5CF6' },
    { id: 5, name: 'Bills', icon: FileText, color: '#F59E0B' },
    { id: 6, name: 'Fun', icon: Film, color: '#EC4899' },
    { id: 7, name: 'Health', icon: Heart, color: '#14B8A6' },
    { id: 8, name: 'Travel', icon: Plane, color: '#06B6D4' },
    { id: 9, name: 'Home', icon: Home, color: '#F97316' },
    { id: 10, name: 'School', icon: BookOpen, color: '#6366F1' },
    { id: 11, name: 'Personal', icon: User, color: '#F43F5E' },
];

const DEFAULT_CATEGORY = { id: 999, name: 'Unnamed', icon: Circle, color: '#8A8A87' };

const COLORS = {
    bg: '#1A1A1A',
    textPrimary: '#F2F2F0',
    textMuted: '#8A8A87',
    hairline: 'rgba(242,242,240,0.08)',
    accent: '#F2F2F0',
};

const fontFamily = Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' });

interface AddExpenseSheetProps {
    defaultType?: 'income' | 'expense';
}

export default function AddExpenseSheet({ defaultType = 'expense' }: AddExpenseSheetProps) {
    const router = useRouter();
    const [type] = useState<'income' | 'expense'>(defaultType);
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
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

        const category = selectedCategory || DEFAULT_CATEGORY;

        await addTransaction({
            amount: value,
            transaction_type: type,
            categoryId: category.id,
            accountId: defaultAccount.id,
            transaction_date: date.toISOString(),
            categoryName: category.name,
            categoryIcon: category.name,
            categoryColor: category.color,
        });
        close();
    }, [amount, type, selectedCategory, date, defaultAccount, addTransaction, close]);

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
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: COLORS.textPrimary }]}>Add {type === 'expense' ? 'expense' : 'income'}</Text>
                <TouchableOpacity onPress={close} hitSlop={12}>
                    <X size={22} color={COLORS.textPrimary} strokeWidth={2.25} />
                </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
                <View style={styles.amountRow}>
                    <Text style={[styles.currencySymbol, { color: COLORS.textMuted }]}>₵</Text>
                    <TextInput
                        style={[styles.heroAmountInput, { color: COLORS.textPrimary }]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Amount"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="decimal-pad"
                        autoFocus
                        selectionColor={COLORS.textPrimary}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: COLORS.textMuted }]}>Category</Text>
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory?.id === cat.id;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                                onPress={() => setSelectedCategory(cat)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.categoryBadge, { backgroundColor: `${cat.color}26` }]}>
                                    <Icon size={18} color={cat.color} strokeWidth={2.25} />
                                </View>
                                <Text style={[styles.categoryLabel, { color: COLORS.textPrimary }]} numberOfLines={1}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: COLORS.textMuted }]}>When</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.whenButton} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                        <Calendar size={18} color={COLORS.textMuted} strokeWidth={2} />
                        <Text style={[styles.rowLabel, { color: COLORS.textPrimary }]}>{formatDate(date)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.whenButton} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
                        <Clock size={18} color={COLORS.textMuted} strokeWidth={2} />
                        <Text style={[styles.rowLabel, { color: COLORS.textPrimary }]}>{formatTime(date)}</Text>
                    </TouchableOpacity>
                </View>
                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display={pickerDisplay} onChange={onDateChange} />
                )}
                {showTimePicker && (
                    <DateTimePicker value={date} mode="time" display={pickerDisplay} onChange={onTimeChange} />
                )}
            </View>

            <TouchableOpacity
                style={[styles.saveButton, !amount && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!amount}
                activeOpacity={0.85}
            >
                <Text style={[styles.saveButtonText, { color: COLORS.bg }]}>Add {type === 'expense' ? 'expense' : 'income'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 22, fontWeight: '700', fontFamily },
    heroSection: { marginTop: 20, marginBottom: 32, alignItems: 'center', justifyContent: 'center', width: '100%' },
    amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
    currencySymbol: { fontSize: 20, fontWeight: '600', marginRight: 6, fontFamily },
    heroAmountInput: {
        fontSize: 20, fontWeight: '700',
        letterSpacing: -0.5, fontVariant: ['tabular-nums'],
        padding: 0, margin: 0, borderWidth: 0, backgroundColor: 'transparent',
        fontFamily, minWidth: 40,
        ...Platform.select({ web: { outlineStyle: 'none' } }),
    },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3, marginBottom: 12, fontFamily },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    categoryItem: { width: '22%', alignItems: 'center', gap: 6, paddingVertical: 8, borderRadius: 14, borderWidth: 1, borderColor: 'transparent' },
    categoryItemSelected: { borderColor: COLORS.accent, backgroundColor: 'rgba(242,242,240,0.05)' },
    categoryBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    categoryLabel: { fontSize: 12, textAlign: 'center', fontWeight: '500', fontFamily },
    row: { flexDirection: 'row', gap: 12 },
    whenButton: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingVertical: 14, paddingHorizontal: 16, flex: 1,
        borderRadius: 14, borderWidth: 1, borderColor: COLORS.hairline,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    rowLabel: { fontSize: 15, fontWeight: '500', fontFamily },
    saveButton: {
        marginTop: 'auto', marginBottom: 26,
        backgroundColor: COLORS.accent, borderRadius: 18, paddingVertical: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    saveButtonDisabled: { backgroundColor: 'rgba(242,242,240,0.15)' },
    saveButtonText: { fontSize: 17, fontWeight: '700', letterSpacing: 0.3, fontFamily },
});

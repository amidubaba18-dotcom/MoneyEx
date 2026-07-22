import React, { useEffect, useMemo, useState, useCallback, useRef, useImperativeHandle } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTransactionStore } from '../store/useTransactionStore';
import { CategoryPicker } from './CategoryPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from 'react-native-paper';
import { useDefaultAccount } from '../hooks/useDefaultAccount';

export interface AddTransactionSheetHandle {
    open: (type: 'income' | 'expense') => void;
    close: () => void;
}

interface AddTransactionSheetProps {
    defaultType?: 'income' | 'expense';
}

const AddTransactionSheet = React.forwardRef<AddTransactionSheetHandle, AddTransactionSheetProps>(
    ({ defaultType = 'expense' }, ref) => {
        const theme = useTheme();
        const insets = useSafeAreaInsets();
        const snapPoints = useMemo(() => ['92%'], []);
        const sheetRef = useRef<BottomSheet>(null);

        const [amount, setAmount] = useState('');
        const [type, setType] = useState<'income' | 'expense'>(defaultType);
        const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
        const [note, setNote] = useState('');
        const [date, setDate] = useState(new Date());
        const [showDatePicker, setShowDatePicker] = useState(false);

        const addTransaction = useTransactionStore((s) => s.addTransaction);
        const defaultAccount = useDefaultAccount();

        useEffect(() => {
            setType(defaultType);
            setSelectedCategoryId(null);
        }, [defaultType]);

        const open = useCallback((nextType: 'income' | 'expense') => {
            setType(nextType);
            setSelectedCategoryId(null);
            sheetRef.current?.expand();
        }, []);

        const close = useCallback(() => {
            sheetRef.current?.close();
        }, []);

        useImperativeHandle(ref, () => ({ open, close }), [open, close]);

        const handleSave = useCallback(async () => {
            const cleaned = amount.replace(/[,\s]/g, '');
            const value = Number(cleaned);
            if (!value || value <= 0 || !selectedCategoryId || !defaultAccount || Number.isNaN(value)) return;

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await addTransaction({
                amount: value,
                type,
                categoryId: parseInt(selectedCategoryId, 10),
                accountId: defaultAccount.id,
                date,
                note: note.trim() || undefined,
            });

            setAmount('');
            setNote('');
            setSelectedCategoryId(null);
            setDate(new Date());
            close();
        }, [amount, type, selectedCategoryId, date, note, defaultAccount, addTransaction, close]);

        return (
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                )}
                handleIndicatorStyle={{ backgroundColor: theme.colors.outline }}
                backgroundStyle={{ backgroundColor: theme.colors.surface }}
            >
                <BottomSheetView style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
                    {/* Type Toggle */}
                    <View style={styles.typeToggle}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'expense' && styles.activeTypeButton]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setType('expense');
                            }}
                        >
                            <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>
                                Expense
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'income' && styles.activeTypeButton]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setType('income');
                            }}
                        >
                            <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>
                                Income
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Input */}
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor={theme.colors.outline}
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />

                    {/* Category Picker */}
                    <CategoryPicker
                        type={type}
                        selectedCategoryId={selectedCategoryId}
                        onSelect={setSelectedCategoryId}
                    />

                    {/* Date Picker */}
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: theme.colors.onSurface }}>
                            {date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}

                    {/* Note Input */}
                    <TextInput
                        style={styles.noteInput}
                        placeholder="Add a note..."
                        placeholderTextColor={theme.colors.outline}
                        value={note}
                        onChangeText={setNote}
                    />

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save Transaction</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    typeToggle: {
        flexDirection: 'row',
        backgroundColor: '#E8EDF2',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTypeButton: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    typeText: { fontSize: 16, fontWeight: '600', color: '#5C6B7C' },
    activeTypeText: { color: '#27313F' },
    amountInput: {
        fontSize: 48,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
        color: '#27313F',
        borderBottomWidth: 1,
        borderColor: '#D1D9E4',
        paddingBottom: 8,
    },
    dateButton: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#D1D9E4',
        marginBottom: 24,
    },
    noteInput: {
        fontSize: 16,
        borderBottomWidth: 1,
        borderColor: '#D1D9E4',
        paddingVertical: 16,
        marginBottom: 32,
    },
    saveButton: {
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    saveButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
});

export default AddTransactionSheet;
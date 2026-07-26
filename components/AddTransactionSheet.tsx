import React, { useEffect, useMemo, useState, useCallback, useRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, TextInput, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from 'react-native-paper';

import { useTransactionStore } from '../store/useTransactionStore';
import { CategoryPicker, Category } from './CategoryPicker';
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
        const snapPoints = useMemo(() => ['85%'], []);
        const sheetRef = useRef<BottomSheet>(null);

        const [amount, setAmount] = useState('');
        const [type, setType] = useState<'income' | 'expense'>(defaultType);
        const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
        const [note, setNote] = useState('');
        const [date, setDate] = useState(new Date());
        const [showDatePicker, setShowDatePicker] = useState(false);

        const addTransaction = useTransactionStore((s) => s.addTransaction);
        const defaultAccount = useDefaultAccount();

        useEffect(() => {
            setType(defaultType);
            setSelectedCategory(null);
        }, [defaultType]);

        const open = useCallback((nextType: 'income' | 'expense') => {
            setType(nextType);
            setSelectedCategory(null);
            setAmount('');
            setNote('');
            setDate(new Date());
            sheetRef.current?.expand();
        }, []);

        const close = useCallback(() => {
            sheetRef.current?.close();
        }, []);

        useImperativeHandle(ref, () => ({ open, close }), [open, close]);

        const handleSave = useCallback(async () => {
            const value = parseFloat(amount);
            if (isNaN(value) || value <= 0 || !selectedCategory || !defaultAccount) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                return;
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await addTransaction({
                amount: value,
                transaction_type: type,
                categoryId: selectedCategory.id,
                accountId: defaultAccount.id,
                transaction_date: date.toISOString(),
                note: note.trim() || undefined,
                categoryName: selectedCategory.name,
                categoryIcon: selectedCategory.icon,
                categoryColor: selectedCategory.color,
            });
            close();
        }, [amount, type, selectedCategory, date, note, defaultAccount, addTransaction, close]);

        return (
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        disappearsOnIndex={-1}
                        appearsOnIndex={0}
                        opacity={0.5}
                        pressBehavior="close"
                    />
                )}
                handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40, height: 4, borderRadius: 2 }}
                backgroundStyle={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
            >
                <BottomSheetView style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>

                    {/* Type Toggle */}
                    <View style={styles.typeToggle}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'expense' && styles.activeTypeButton]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setType('expense');
                            }}
                            activeOpacity={0.8}
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
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>
                                Income
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Input with native keyboard */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>GH₵</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            placeholderTextColor="#94A3B8"
                            keyboardType="decimal-pad"
                            autoFocus={true}
                            selectionColor="#0F172A"
                        />
                    </View>

                    <ScrollView
                        style={styles.optionsScroll}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.optionsScrollContent}
                    >
                        <CategoryPicker
                            type={type}
                            selectedCategory={selectedCategory}
                            onSelect={setSelectedCategory}
                        />

                        <View style={styles.detailsRow}>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <Calendar size={20} color="#6B7280" style={{ marginRight: 8 }} />
                                <Text style={styles.dateText}>
                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.noteContainer}>
                                <TextInput
                                    style={styles.noteInput}
                                    placeholder="Add a note..."
                                    placeholderTextColor="#9CA3AF"
                                    value={note}
                                    onChangeText={setNote}
                                    returnKeyType="done"
                                    blurOnSubmit
                                />
                            </View>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(Platform.OS === 'ios');
                                    if (selectedDate) setDate(selectedDate);
                                }}
                            />
                        )}
                    </ScrollView>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (!amount || !selectedCategory) && styles.saveButtonDisabled
                        ]}
                        onPress={handleSave}
                        disabled={!amount || !selectedCategory}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.saveButtonText}>
                            Add {type === 'expense' ? 'Expense' : 'Income'}
                        </Text>
                    </TouchableOpacity>

                </BottomSheetView>
            </BottomSheet>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        backgroundColor: '#FFFFFF',
    },
    typeToggle: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 6,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTypeButton: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    typeText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
    activeTypeText: { color: '#111827', fontWeight: '700' },

    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 12,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        marginRight: 6,
        lineHeight: 48,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
        minWidth: 100,
        padding: 0,
        textAlign: 'center',
    },

    optionsScroll: {
        flex: 1,
    },
    optionsScrollContent: {
        paddingBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dateText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    noteContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    noteInput: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
    },

    saveButton: {
        backgroundColor: '#0F172A',
        borderRadius: 24,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 8,
        marginTop: 8,
    },
    saveButtonDisabled: {
        backgroundColor: '#E5E7EB',
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default AddTransactionSheet;

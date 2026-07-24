import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

type Tx = {
    id: number | string;
    transaction_date: number;
    amount: number;
    transaction_type: 'income' | 'expense';
    category_id?: number | null;
    category_name?: string | null;
    category_color?: string | null;
};

export function CalendarCard({ transactions, monthlyExpense }: { transactions: Tx[]; monthlyExpense: number }) {
    const theme = useTheme();
    const colors = (theme && (theme as any).colors) || {
        onBackground: '#111827',
        outline: '#9CA3AF',
        surface: '#FFFFFF',
        primary: '#111827',
        onPrimary: '#FFFFFF',
        secondary: '#10B981',
    };
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [displayDate, setDisplayDate] = useState<Date>(() => new Date());

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = startOfMonth.getDay();

    const txByDay = useMemo(() => {
        const map: Record<number, Tx[]> = {};
        transactions.forEach((t) => {
            const d = new Date(t.transaction_date).getDate();
            const m = new Date(t.transaction_date).getMonth();
            const y = new Date(t.transaction_date).getFullYear();
            if (m === month && y === year) {
                map[d] = map[d] || [];
                map[d].push(t);
            }
        });
        return map;
    }, [transactions, month, year]);

    const cells: Array<{ day: number | null; hasTx: boolean; count?: number }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null, hasTx: false });
    for (let d = 1; d <= daysInMonth; d++) {
        const list = txByDay[d] || [];
        cells.push({ day: d, hasTx: list.length > 0, count: list.length });
    }

    function prevMonth() {
        setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
        setSelectedDay(null);
    }

    function nextMonth() {
        setDisplayDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
        setSelectedDay(null);
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={prevMonth} style={styles.chev}>
                    <Text style={{ color: colors.primary, fontSize: 18 }}>{'‹'}</Text>
                </TouchableOpacity>
                <Text style={[styles.monthTitle, { color: colors.onBackground }]}>{displayDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</Text>
                <TouchableOpacity onPress={nextMonth} style={styles.chev}>
                    <Text style={{ color: colors.primary, fontSize: 18 }}>{'›'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                    <Text key={d} style={[styles.weekLabel, { color: colors.outline }]}>{d}</Text>
                ))}
            </View>

            <View style={styles.grid}>
                {cells.map((cell, idx) => {
                    if (!cell.day) return <View key={idx} style={styles.emptyCell} />;
                    const isSelected = selectedDay === cell.day;
                    return (
                        <TouchableOpacity key={idx} style={styles.cellWrap} onPress={() => setSelectedDay(cell.day)}>
                            <View style={[styles.cell, isSelected && { backgroundColor: colors.primary }]}>
                                <Text style={[styles.dayText, isSelected ? { color: colors.onPrimary } : { color: colors.onBackground }]}>{cell.day}</Text>
                            </View>
                            {cell.hasTx ? <View style={[styles.badge, { backgroundColor: '#FF8A00' }]}><Text style={styles.badgeText}>{cell.count}</Text></View> : null}
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.footerRow}>
                <Text style={{ color: colors.outline }}>Total this month</Text>
                <Text style={{ color: colors.onBackground, fontWeight: '800' }}>{monthlyExpense ? `${formatCurrencyDisplay(monthlyExpense)}` : '$0.00'}</Text>
            </View>
        </View>
    );
}

function formatCurrencyDisplay(value: number) {
    if (!Number.isFinite(value)) return '$0.00';
    // guess whether value is cents (large int) or dollars
    if (Math.abs(value) > 1000) return `$${(value / 100).toFixed(2)}`;
    return `$${value.toFixed(2)}`;
}

const styles = StyleSheet.create({
    container: { borderRadius: 16, padding: 14, marginBottom: 18 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    chev: { paddingHorizontal: 8, paddingVertical: 4 },
    monthTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
    weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, marginBottom: 6, marginTop: 8 },
    weekLabel: { width: 28, textAlign: 'center', fontSize: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    cellWrap: { width: `${100 / 7}%`, height: 64, alignItems: 'center', justifyContent: 'center' },
    cell: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    emptyCell: { width: `${100 / 7}%`, height: 64 },
    dayText: { fontSize: 14, fontWeight: '700' },
    badge: { position: 'absolute', right: 16, top: 8, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
});

export default CalendarCard;

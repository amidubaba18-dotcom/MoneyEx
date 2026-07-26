import { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';

export function useBalance() {
    const transactions = useTransactionStore((s) => s.transactions);

    const { income, expense, balance, previousIncome } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const isCurrentMonth = (date: Date) => {
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        };
        const isPreviousMonth = (date: Date) => {
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
        };

        const inc = transactions
            .filter((t) => t.transaction_type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const exp = transactions
            .filter((t) => t.transaction_type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Previous month income
        const prevInc = transactions
            .filter((t) => {
                const d = new Date(t.transaction_date);
                return t.transaction_type === 'income' && isPreviousMonth(d);
            })
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income: inc,
            expense: exp,
            balance: inc - exp,
            previousIncome: prevInc,
        };
    }, [transactions]);

    // Calculate percentage change from previous month
    const percentageChange = useMemo(() => {
        // ✅ FIX: If no previous income, show 0% with positive flag
        if (previousIncome === 0) {
            return { value: 0, isPositive: true };
        }
        const change = ((income - previousIncome) / previousIncome) * 100;
        return {
            value: change,
            isPositive: change >= 0,
        };
    }, [income, previousIncome]);

    return { balance, income, expense, percentageChange };
}

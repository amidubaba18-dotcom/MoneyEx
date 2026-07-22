import { useMemo } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';

export function useBalance() {
  const transactions = useTransactionStore((s) => s.transactions);

  const { income, expense, balance } = useMemo(() => {
    const inc = transactions
      .filter((t) => t.transaction_type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const exp = transactions
      .filter((t) => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income: inc,
      expense: exp,
      balance: inc - exp,
    };
  }, [transactions]);

  return { balance, income, expense };
}
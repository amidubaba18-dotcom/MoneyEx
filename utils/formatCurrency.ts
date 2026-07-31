import { useCurrencyStore } from '../store/useCurrencyStore';
import { CURRENCIES } from './currencies';

// Pure formatter — use when you already have the code (e.g. outside components).
export function formatCurrencyWithCode(amount: number, code: string): string {
    const currency = CURRENCIES.find((c) => c.code === code);
    const symbol = currency?.symbol || '₵';

    const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    const sign = amount < 0 ? '-' : '';
    return `${sign}${symbol}${formattedNumber}`;
}

// Hook version — subscribes to the currency store, so any component using
// this re-renders automatically the moment the currency changes.
export function useFormatCurrency() {
    const code = useCurrencyStore((s) => s.code);
    return (amount: number) => formatCurrencyWithCode(amount, code);
}
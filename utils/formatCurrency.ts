import { useCurrencyStore } from '../store/useCurrencyStore';
import { CURRENCIES } from './currencies';

// ---------------------------------------------------------------------------
// Formats an amount using the currently selected currency.
// Uses the symbol from the CURRENCIES list, not the ISO code.
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number): string {
    const { code } = useCurrencyStore.getState();
    const currency = CURRENCIES.find((c) => c.code === code);
    const symbol = currency?.symbol || '₵';

    // Format the number with proper grouping and decimals (en-US locale)
    const formattedNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    const sign = amount < 0 ? '-' : '';
    return `${sign}${symbol}${formattedNumber}`;
}

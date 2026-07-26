export function formatCurrency(amount: number): string {
    const absAmount = Math.abs(amount);
    const formatted = absAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return amount < 0 ? `GH₵-${formatted}` : `GH₵${formatted}`;
}

/**
 * Format a number as Indian Rupees with proper Indian numbering system.
 * e.g. 100000 → ₹1,00,000
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format with sign prefix for transactions
 */
export function formatSignedCurrency(amount: number, type: 'income' | 'expense'): string {
  const formatted = formatCurrency(amount);
  return type === 'income' ? `+${formatted}` : `-${formatted}`;
}

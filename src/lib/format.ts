// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/** Format a number as AUD currency, rounded to nearest dollar. */
export function formatDollars(amount: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 0;
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/** Format a number as AUD showing cents (for fee/rate display). */
export function formatDollarsAndCents(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format a plain number with thousands separators. */
export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/** Format a percentage value. e.g. 24.288 → "24.3%" */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Format a number of days as a human-readable string. e.g. 265 → "265 days (~9 months)" */
export function formatDays(days: number): string {
  if (days < 30) return `${days} day${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30);
  return `${days} days (~${months} month${months === 1 ? '' : 's'})`;
}

/** Format a date string like "2025-09-20" as "20 September 2025". */
export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Format a cover tier for display. */
export function formatTier(tier: string): string {
  const labels: Record<string, string> = {
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze',
    basic: 'Basic',
  };
  return labels[tier.toLowerCase()] ?? tier;
}

/** Format an income range for display. */
export function formatIncomeRange(range: string): string {
  const labels: Record<string, string> = {
    'under-90k': 'Under $90,000',
    '90k-110k': '$90,000 – $110,000',
    '110k-140k': '$110,000 – $140,000',
    '140k-175k': '$140,000 – $175,000',
    '175k-250k': '$175,000 – $250,000',
    'over-250k': 'Over $250,000',
  };
  return labels[range] ?? range;
}

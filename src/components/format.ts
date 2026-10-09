const gramsFormatter = new Intl.NumberFormat("it-IT", {
  maximumFractionDigits: 1,
});

/**
 * Formats a gram amount for display with at most one decimal (Italian locale).
 * Rounding happens only here, never in the calculation layer.
 */
export function formatGrams(value: number): string {
  return gramsFormatter.format(value);
}

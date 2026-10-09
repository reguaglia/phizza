const DECIMAL_PATTERN = /^\d+(,\d+)?$/;

/**
 * Parses a user-entered decimal that uses the comma as separator.
 * Returns null when the value is empty or not a valid non-negative decimal.
 */
export function parseDecimal(raw: string): number | null {
  const trimmed = raw.trim();
  if (!DECIMAL_PATTERN.test(trimmed)) {
    return null;
  }
  return Number(trimmed.replace(",", "."));
}

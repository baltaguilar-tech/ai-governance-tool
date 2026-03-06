/**
 * Best-effort parser for free-text AI spend strings entered in the org profile.
 *
 * Handles common user inputs such as:
 *   "$50,000"  "50K"  "$1.2M/year"  "100000"  "~$75k"  "$500/mo"
 *
 * Returns null if the string cannot be resolved to a positive number.
 * Callers should silently skip pre-population on null — never crash.
 */
export function parseSpendAmount(raw: string): number | null {
  if (!raw) return null;

  // Strip leading ~, whitespace, $, commas
  let s = raw.trim().replace(/^~\s*/, '').replace(/[$,\s]/g, '');

  // Strip time suffixes: /year, /yr, /month, /mo, /annum
  s = s.replace(/\/(year|yr|month|mo|annum)/i, '');
  // Strip trailing prose suffixes: "per year", "per month", etc.
  s = s.replace(/per\s*(year|month|annum)/i, '');

  // Handle K and M multipliers
  let multiplier = 1;
  if (/k$/i.test(s)) {
    multiplier = 1_000;
    s = s.slice(0, -1);
  } else if (/m$/i.test(s)) {
    multiplier = 1_000_000;
    s = s.slice(0, -1);
  }

  const n = parseFloat(s);
  if (isNaN(n) || n <= 0) return null;

  return n * multiplier;
}

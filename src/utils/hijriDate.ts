// ─────────────────────────────────────────────────────────────────────────────
//  src/utils/hijriDate.ts
//  Pure-function Hijri calendar conversion (no external dependency).
//  Uses the algorithmic approximation from the Umm al-Qura calendar.
//  Accurate to within ±1 day for common use-cases; replace with a
//  dedicated library (e.g. `moment-hijri`) if ±0 precision is required.
// ─────────────────────────────────────────────────────────────────────────────

import { HijriDate } from '../types/prayer.types';

const HIJRI_MONTH_NAMES: readonly string[] = [
  'Muharram',
  'Safar',
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhu al-Qi'dah",
  'Dhu al-Hijjah',
];

/**
 * Convert a Gregorian Date to a Hijri date object.
 * Algorithm: Julian Day Number approach.
 */
export function toHijriDate(gregorianDate: Date): HijriDate {
  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1; // 1-based
  const day = gregorianDate.getDate();

  // Julian Day Number calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  let jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Convert JDN to Hijri
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const ll = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - ll) / 5316) * Math.floor((50 * ll) / 17719) +
    Math.floor(ll / 5670) * Math.floor((43 * ll) / 15238);
  const lll =
    ll -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const hijriMonth = Math.floor((24 * lll) / 709);
  const hijriDay = lll - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const monthName = HIJRI_MONTH_NAMES[hijriMonth - 1] ?? 'Unknown';
  const formatted = `${hijriDay} ${monthName} ${hijriYear}`;

  return {
    day: hijriDay,
    month: hijriMonth,
    monthName,
    year: hijriYear,
    formatted,
  };
}

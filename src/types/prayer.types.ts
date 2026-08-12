// ─────────────────────────────────────────────────────────────────────────────
//  src/types/prayer.types.ts
//  Strict TypeScript interfaces for Prayer Times & Hijri date.
// ─────────────────────────────────────────────────────────────────────────────

/** Supported Adhan calculation methods */
export type CalculationMethodName =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

/** Query parameters accepted by the /prayers/timings endpoint */
export interface PrayerTimingsQuery {
  latitude?: string;
  longitude?: string;
  date?: string;      // YYYY-MM-DD
  method?: string;    // CalculationMethodName value
}

/** Individual prayer times as ISO time strings (HH:MM) */
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/** Hijri date representation */
export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;  // e.g. "15 Muharram 1446"
}

/** Full prayer timings response payload */
export interface PrayerTimingsResponse {
  date: string;            // Gregorian date (YYYY-MM-DD)
  hijriDate: HijriDate;
  location: {
    latitude: number;
    longitude: number;
  };
  calculationMethod: string;
  timings: PrayerTimes;
}

/** Health-check payload */
export interface HealthCheckData {
  uptime: number;
  timestamp: string;
}

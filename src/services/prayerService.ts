// ─────────────────────────────────────────────────────────────────────────────
//  src/services/prayerService.ts
//  Business logic for prayer times using the `adhan` npm package (v3).
//  Calculates precise prayer times and Hijri date for any coordinate/date.
// ─────────────────────────────────────────────────────────────────────────────

// adhan v3 is a pure CommonJS module — import works cleanly without ESM issues.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Adhan = require('adhan') as AdhanModule;

import {
  PrayerTimingsQuery,
  PrayerTimingsResponse,
  CalculationMethodName,
} from '../types/prayer.types';
import { AppError } from '../utils/AppError';
import { toHijriDate } from '../utils/hijriDate';

// ── Adhan v3 type surface ─────────────────────────────────────────────────────

interface AdhanCalculationParameters {
  fajrAngle?: number;
  ishaAngle?: number;
  ishaInterval?: number;
}

interface AdhanPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

interface AdhanCalculationMethod {
  MuslimWorldLeague(): AdhanCalculationParameters;
  Egyptian(): AdhanCalculationParameters;
  Karachi(): AdhanCalculationParameters;
  UmmAlQura(): AdhanCalculationParameters;
  Dubai(): AdhanCalculationParameters;
  MoonsightingCommittee(): AdhanCalculationParameters;
  NorthAmerica(): AdhanCalculationParameters;
  Kuwait(): AdhanCalculationParameters;
  Qatar(): AdhanCalculationParameters;
  Singapore(): AdhanCalculationParameters;
  Tehran(): AdhanCalculationParameters;
  Turkey(): AdhanCalculationParameters;
}

interface AdhanCoordinatesConstructor {
  new (latitude: number, longitude: number): object;
}

interface AdhanPrayerTimesConstructor {
  new (
    coordinates: object,
    date: Date,
    params: AdhanCalculationParameters,
  ): AdhanPrayerTimes;
}

interface AdhanModule {
  Coordinates: AdhanCoordinatesConstructor;
  CalculationMethod: AdhanCalculationMethod;
  PrayerTimes: AdhanPrayerTimesConstructor;
}

// ── Adhan calculation method registry ────────────────────────────────────────

type AdhanMethodFactory = () => AdhanCalculationParameters;

const METHOD_MAP: Readonly<Record<CalculationMethodName, AdhanMethodFactory>> = {
  MuslimWorldLeague:    () => Adhan.CalculationMethod.MuslimWorldLeague(),
  Egyptian:             () => Adhan.CalculationMethod.Egyptian(),
  Karachi:              () => Adhan.CalculationMethod.Karachi(),
  UmmAlQura:            () => Adhan.CalculationMethod.UmmAlQura(),
  Dubai:                () => Adhan.CalculationMethod.Dubai(),
  MoonsightingCommittee:() => Adhan.CalculationMethod.MoonsightingCommittee(),
  NorthAmerica:         () => Adhan.CalculationMethod.NorthAmerica(),
  Kuwait:               () => Adhan.CalculationMethod.Kuwait(),
  Qatar:                () => Adhan.CalculationMethod.Qatar(),
  Singapore:            () => Adhan.CalculationMethod.Singapore(),
  Tehran:               () => Adhan.CalculationMethod.Tehran(),
  Turkey:               () => Adhan.CalculationMethod.Turkey(),
};

// ── Default values (Sanaa, Yemen) ────────────────────────────────────────────

const DEFAULT_LATITUDE  = parseFloat(process.env['DEFAULT_LATITUDE']  ?? '15.3694');
const DEFAULT_LONGITUDE = parseFloat(process.env['DEFAULT_LONGITUDE'] ?? '44.1910');
const DEFAULT_METHOD: CalculationMethodName =
  (process.env['DEFAULT_CALCULATION_METHOD'] as CalculationMethodName | undefined) ??
  'MuslimWorldLeague';

// ── Helper: format a Date to HH:MM (local time) ──────────────────────────────

function formatTime(date: Date): string {
  const hours   = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// ── Public service function ───────────────────────────────────────────────────

/**
 * Calculate prayer times and Hijri date for the given query parameters.
 * All parameters are optional — sensible defaults are applied automatically.
 */
export function calculatePrayerTimings(
  query: PrayerTimingsQuery,
): PrayerTimingsResponse {
  // ── Parse coordinates ───────────────────────────────────────────────────
  const latitude  = query.latitude  ? parseFloat(query.latitude)  : DEFAULT_LATITUDE;
  const longitude = query.longitude ? parseFloat(query.longitude) : DEFAULT_LONGITUDE;

  // ── Parse date ──────────────────────────────────────────────────────────
  let targetDate: Date;
  if (query.date) {
    targetDate = new Date(`${query.date}T00:00:00`);
    if (isNaN(targetDate.getTime())) {
      throw new AppError('Provided date could not be parsed. Use YYYY-MM-DD format.', 400);
    }
  } else {
    targetDate = new Date();
  }

  // ── Resolve calculation method ──────────────────────────────────────────
  const methodName: CalculationMethodName =
    (query.method as CalculationMethodName | undefined) ?? DEFAULT_METHOD;

  const methodFactory = METHOD_MAP[methodName];
  if (!methodFactory) {
    throw new AppError(`Unknown calculation method: ${methodName}`, 400);
  }

  // ── Run adhan ───────────────────────────────────────────────────────────
  const coordinates = new Adhan.Coordinates(latitude, longitude);
  const params      = methodFactory();

  const prayerTimes = new Adhan.PrayerTimes(
    coordinates,
    targetDate,
    params,
  );

  // ── Build response ──────────────────────────────────────────────────────
  const gregorianDateStr = [
    targetDate.getFullYear(),
    String(targetDate.getMonth() + 1).padStart(2, '0'),
    String(targetDate.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    date:      gregorianDateStr,
    hijriDate: toHijriDate(targetDate),
    location:  { latitude, longitude },
    calculationMethod: methodName,
    timings: {
      fajr:    formatTime(prayerTimes.fajr),
      sunrise: formatTime(prayerTimes.sunrise),
      dhuhr:   formatTime(prayerTimes.dhuhr),
      asr:     formatTime(prayerTimes.asr),
      maghrib: formatTime(prayerTimes.maghrib),
      isha:    formatTime(prayerTimes.isha),
    },
  };
}

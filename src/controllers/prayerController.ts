// ─────────────────────────────────────────────────────────────────────────────
//  src/controllers/prayerController.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import { calculatePrayerTimings } from '../services/prayerService';
import { PrayerTimingsQuery } from '../types/prayer.types';
import { sendSuccess } from '../utils/responseHandler';

/**
 * GET /api/v1/prayers/timings
 * Query params (all optional):
 *   - latitude   : number
 *   - longitude  : number
 *   - date       : YYYY-MM-DD
 *   - method     : CalculationMethodName
 */
export function getPrayerTimings(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const query = req.query as PrayerTimingsQuery;
    const result = calculatePrayerTimings(query);
    sendSuccess(
      res,
      `Prayer times for ${result.date} calculated successfully using ${result.calculationMethod} method.`,
      result,
    );
  } catch (err) {
    next(err);
  }
}

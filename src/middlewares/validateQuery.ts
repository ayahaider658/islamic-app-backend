// ─────────────────────────────────────────────────────────────────────────────
//  src/middlewares/validateQuery.ts
//  Input validation middleware for query-string parameters.
//  Throws an AppError (400) if required parameters are invalid,
//  so the global error handler sends a clean, uniform JSON response.
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { CalculationMethodName } from '../types/prayer.types';

/** All method names supported by Adhan */
const VALID_METHODS: readonly CalculationMethodName[] = [
  'MuslimWorldLeague',
  'Egyptian',
  'Karachi',
  'UmmAlQura',
  'Dubai',
  'MoonsightingCommittee',
  'NorthAmerica',
  'Kuwait',
  'Qatar',
  'Singapore',
  'Tehran',
  'Turkey',
];

/** ISO date regex: YYYY-MM-DD */
const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/**
 * Validates query parameters for the prayer timings endpoint.
 * Allowed to be partially omitted — defaults are applied in the service.
 */
export const validatePrayerQuery: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { latitude, longitude, date, method } = req.query as Record<
    string,
    string | undefined
  >;

  // Validate latitude if provided
  if (latitude !== undefined) {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return next(
        new AppError(
          'Invalid `latitude` query parameter. Must be a number between -90 and 90.',
          400,
        ),
      );
    }
  }

  // Validate longitude if provided
  if (longitude !== undefined) {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return next(
        new AppError(
          'Invalid `longitude` query parameter. Must be a number between -180 and 180.',
          400,
        ),
      );
    }
  }

  // Validate date if provided
  if (date !== undefined && !DATE_REGEX.test(date)) {
    return next(
      new AppError(
        'Invalid `date` query parameter. Expected format: YYYY-MM-DD.',
        400,
      ),
    );
  }

  // Validate method if provided
  if (method !== undefined && !VALID_METHODS.includes(method as CalculationMethodName)) {
    return next(
      new AppError(
        `Invalid \`method\` query parameter. Valid values: ${VALID_METHODS.join(', ')}.`,
        400,
      ),
    );
  }

  next();
};

/**
 * Validates the :id route parameter for Surah endpoints.
 * ID must be an integer between 1 and 114.
 */
export const validateSurahId: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const id = parseInt(req.params['id'] ?? '', 10);

  if (isNaN(id) || id < 1 || id > 114) {
    return next(
      new AppError(
        'Invalid Surah ID. Must be an integer between 1 and 114.',
        400,
      ),
    );
  }

  next();
};

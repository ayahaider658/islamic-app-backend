// ─────────────────────────────────────────────────────────────────────────────
//  src/controllers/azkarController.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import { getAllAzkar, getAzkarByCategory } from '../services/azkarService';
import { sendSuccess } from '../utils/responseHandler';

/**
 * GET /api/v1/azkar
 * Returns all Azkar categories with their items.
 */
export function listAzkar(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const azkar = getAllAzkar();
    sendSuccess(res, `Retrieved ${azkar.length} Azkar categories successfully.`, { azkar });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/azkar/category/:category
 * Returns Azkar items for a specific category slug.
 */
export function getAzkarCategory(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const { category } = req.params as { category: string };
    const result = getAzkarByCategory(category);
    sendSuccess(
      res,
      `Azkar for category "${result.category}" retrieved successfully.`,
      { azkar: result },
    );
  } catch (err) {
    next(err);
  }
}

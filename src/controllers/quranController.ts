// ─────────────────────────────────────────────────────────────────────────────
//  src/controllers/quranController.ts
//  Thin controller layer — parses HTTP input, delegates to the service,
//  and serialises the result using the uniform response helper.
//  All error propagation uses next(err) for the global error handler.
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import { getAllSurahs, getSurahById } from '../services/quranService';
import { sendSuccess } from '../utils/responseHandler';

/**
 * GET /api/v1/quran/surahs
 * Returns metadata for all available Surahs (no Ayahs).
 */
export function listSurahs(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const surahs = getAllSurahs();
    sendSuccess(res, `Retrieved ${surahs.length} Surahs successfully.`, { surahs });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/quran/surahs/:id
 * Returns full Surah detail including all Ayahs.
 * Responds with 400 (validation middleware) or 404 (service) if ID is invalid.
 */
export function getSurah(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const id = parseInt(req.params['id'] ?? '', 10);
    const surah = getSurahById(id);
    sendSuccess(res, `Surah "${surah.englishName}" retrieved successfully.`, { surah });
  } catch (err) {
    next(err);
  }
}

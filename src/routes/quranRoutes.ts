// ─────────────────────────────────────────────────────────────────────────────
//  src/routes/quranRoutes.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { listSurahs, getSurah } from '../controllers/quranController';
import { validateSurahId } from '../middlewares/validateQuery';

const router = Router();

/**
 * GET /api/v1/quran/surahs
 * Returns metadata list of all Surahs.
 */
router.get('/surahs', listSurahs);

/**
 * GET /api/v1/quran/surahs/:id
 * Returns full Surah detail (including Ayahs) for the given number (1-114).
 */
router.get('/surahs/:id', validateSurahId, getSurah);

export default router;

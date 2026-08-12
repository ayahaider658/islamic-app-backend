// ─────────────────────────────────────────────────────────────────────────────
//  src/routes/prayerRoutes.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { getPrayerTimings } from '../controllers/prayerController';
import { validatePrayerQuery } from '../middlewares/validateQuery';

const router = Router();

/**
 * GET /api/v1/prayers/timings
 * Query params (all optional):
 *   - latitude            number  (default: 15.3694 — Sanaa, Yemen)
 *   - longitude           number  (default: 44.1910 — Sanaa, Yemen)
 *   - date                string  YYYY-MM-DD (default: today)
 *   - method              string  CalculationMethodName (default: MuslimWorldLeague)
 */
router.get('/timings', validatePrayerQuery, getPrayerTimings);

export default router;

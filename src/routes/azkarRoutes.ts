// ─────────────────────────────────────────────────────────────────────────────
//  src/routes/azkarRoutes.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { listAzkar, getAzkarCategory } from '../controllers/azkarController';

const router = Router();

/**
 * GET /api/v1/azkar
 * Returns all Azkar categories.
 */
router.get('/', listAzkar);

/**
 * GET /api/v1/azkar/category/:category
 * Returns Azkar filtered by category slug (e.g. morning, evening, after-prayer).
 */
router.get('/category/:category', getAzkarCategory);

export default router;

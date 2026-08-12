// ─────────────────────────────────────────────────────────────────────────────
//  src/routes/healthRoutes.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

/**
 * GET /health
 * Liveness / readiness probe for deployment platforms.
 */
router.get('/', healthCheck);

export default router;

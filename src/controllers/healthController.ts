// ─────────────────────────────────────────────────────────────────────────────
//  src/controllers/healthController.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response } from 'express';
import { HealthCheckData } from '../types/prayer.types';
import { sendSuccess } from '../utils/responseHandler';

/**
 * GET /health
 * Lightweight liveness probe — returns process uptime and current timestamp.
 * No next(err) needed here; this handler never throws.
 */
export function healthCheck(_req: Request, res: Response): void {
  const data: HealthCheckData = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
  sendSuccess(res, 'API is healthy', data);
}

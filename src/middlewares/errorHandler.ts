// ─────────────────────────────────────────────────────────────────────────────
//  src/middlewares/errorHandler.ts
//  Global Express error-handling middleware.
//  Must be registered LAST (after all routes) in app.ts.
//  Catches AppError instances, Joi/Express validation errors, and any
//  unexpected runtime errors — always returning the uniform JSON envelope.
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../types/common.types';

const isDevelopment = process.env['NODE_ENV'] === 'development';

/**
 * Build a uniform error response body.
 */
function buildErrorBody(message: string): ApiResponse<null> {
  return {
    status: 'error',
    message,
    data: null,
  };
}

/**
 * Global error handler — catches everything thrown in route handlers.
 * The four-argument signature is required by Express to identify this
 * function as an error-handling middleware.
 */
export const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // ── Operational / expected errors (AppError) ────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json(buildErrorBody(err.message));
    return;
  }

  // ── SyntaxError — malformed JSON body ───────────────────────────────────
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(buildErrorBody('Malformed JSON in request body.'));
    return;
  }

  // ── Unknown / programming errors ─────────────────────────────────────────
  const message = isDevelopment
    ? (err instanceof Error ? err.message : String(err))
    : 'An unexpected internal server error occurred. Please try again later.';

  if (isDevelopment && err instanceof Error) {
    console.error('[GlobalErrorHandler]', err.stack);
  } else {
    console.error('[GlobalErrorHandler] Unhandled error:', err);
  }

  res.status(500).json(buildErrorBody(message));
};

/**
 * 404 Not-Found handler — registered after all routes but before the
 * global error handler, so un-matched routes get a clean JSON 404.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

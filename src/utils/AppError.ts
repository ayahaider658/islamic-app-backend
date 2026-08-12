// ─────────────────────────────────────────────────────────────────────────────
//  src/utils/AppError.ts
//  Custom application error class.
//  Thrown anywhere in the service/controller layer and caught by the
//  global error-handling middleware in src/middlewares/errorHandler.ts.
// ─────────────────────────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * @param message        Human-readable description shown to the client
   * @param statusCode     HTTP status code (e.g. 400, 404, 422, 500)
   * @param isOperational  `true` for expected domain errors, `false` for
   *                       unexpected programming errors (default true)
   */
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper prototype chain in TypeScript when extending built-ins
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace (V8 only — no-op in other engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

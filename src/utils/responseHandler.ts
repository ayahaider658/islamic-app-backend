// ─────────────────────────────────────────────────────────────────────────────
//  src/utils/responseHandler.ts
//  Factory functions that build uniform JSON envelopes for every response.
//  Controllers call these to guarantee consistency across all endpoints.
// ─────────────────────────────────────────────────────────────────────────────

import { Response } from 'express';
import { ApiResponse } from '../types/common.types';

/**
 * Send a 200-series success response.
 *
 * @param res     Express Response object
 * @param message Human-readable success message
 * @param data    Payload to embed in the `data` field
 * @param code    HTTP status code (default 200)
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  code = 200,
): Response<ApiResponse<T>> => {
  const body: ApiResponse<T> = {
    status: 'success',
    message,
    data,
  };
  return res.status(code).json(body);
};

/**
 * Send an error response without throwing — useful inside catch blocks
 * where you want to send a specific HTTP code without relying on the
 * global error handler.
 *
 * @param res     Express Response object
 * @param message Human-readable error message
 * @param code    HTTP status code (default 500)
 */
export const sendError = (
  res: Response,
  message: string,
  code = 500,
): Response<ApiResponse<null>> => {
  const body: ApiResponse<null> = {
    status: 'error',
    message,
    data: null,
  };
  return res.status(code).json(body);
};

// ─────────────────────────────────────────────────────────────────────────────
//  src/types/common.types.ts
//  Shared response envelope types — mirrors Flutter's ApiResponse<T> model
// ─────────────────────────────────────────────────────────────────────────────

export type ApiStatus = 'success' | 'error';

/** Uniform JSON envelope returned by every endpoint */
export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  message: string;
  data: T | null;
}

/** Pagination metadata (reserved for future list endpoints) */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

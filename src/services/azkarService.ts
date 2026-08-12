// ─────────────────────────────────────────────────────────────────────────────
//  src/services/azkarService.ts
//  Business logic for Azkar (Islamic remembrances) data.
// ─────────────────────────────────────────────────────────────────────────────

import path from 'path';
import { AzkarCategory, AzkarJsonFile } from '../types/azkar.types';
import { AppError } from '../utils/AppError';

// ── Data loading ──────────────────────────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, '../../src/data');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const azkarData = require(path.join(DATA_DIR, 'sample-azkar.json')) as AzkarJsonFile;

// O(1) lookup by slug
const azkarBySlug = new Map<string, AzkarCategory>(
  azkarData.azkar.map((cat) => [cat.slug.toLowerCase(), cat]),
);

// ── Public service functions ──────────────────────────────────────────────────

/**
 * Returns all Azkar categories with their items.
 */
export function getAllAzkar(): AzkarCategory[] {
  return azkarData.azkar;
}

/**
 * Returns a single Azkar category matching the given slug (case-insensitive).
 *
 * @throws AppError(404) if no category matches the given slug.
 */
export function getAzkarByCategory(category: string): AzkarCategory {
  const normalised = category.toLowerCase().trim();
  const result = azkarBySlug.get(normalised);

  if (!result) {
    const available = Array.from(azkarBySlug.keys()).join(', ');
    throw new AppError(
      `Azkar category "${category}" not found. Available categories: ${available}.`,
      404,
    );
  }

  return result;
}

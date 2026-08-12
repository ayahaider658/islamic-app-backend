// ─────────────────────────────────────────────────────────────────────────────
//  src/services/quranService.ts
//  Business logic for Quran data.
//  Loads JSON files once at module initialisation (in-memory cache) for
//  fast, zero-latency lookups — ideal for a stateless REST deployment.
// ─────────────────────────────────────────────────────────────────────────────

import path from 'path';
import { SurahMeta, SurahDetail, SurahsJsonFile, QuranDetailsJsonFile } from '../types/quran.types';
import { AppError } from '../utils/AppError';

// ── Data loading (module-level — loaded once on first import) ────────────────
// Resolve data files relative to the project root so the same paths work
// whether running from src/ (ts-node-dev) or dist/ (compiled JS).
const DATA_DIR = path.resolve(__dirname, '../../src/data');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const surahsData = require(path.join(DATA_DIR, 'sample-surahs.json')) as SurahsJsonFile;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const quranDetailsData = require(path.join(DATA_DIR, 'sample-quran-details.json')) as QuranDetailsJsonFile;

// Build an O(1) lookup map keyed by Surah number
const surahDetailMap = new Map<number, SurahDetail>(
  quranDetailsData.surahs.map((s) => [s.number, s]),
);

// ── Public service functions ─────────────────────────────────────────────────

/**
 * Returns the metadata list of all Surahs (no Ayahs).
 */
export function getAllSurahs(): SurahMeta[] {
  return surahsData.surahs;
}

/**
 * Returns the full detail of a single Surah including its Ayahs.
 *
 * @throws AppError(404) if no Surah with the given number exists in the dataset.
 * @throws AppError(404) if the Surah exists in metadata but has no detail data.
 */
export function getSurahById(id: number): SurahDetail {
  // Verify the ID is within valid Quran range (1-114)
  if (id < 1 || id > 114) {
    throw new AppError(`Surah number ${id} is out of valid range (1–114).`, 404);
  }

  const surah = surahDetailMap.get(id);
  if (!surah) {
    throw new AppError(
      `Surah with number ${id} was not found in the current dataset. ` +
        'Full Quran data can be loaded by replacing the sample JSON files.',
      404,
    );
  }

  return surah;
}

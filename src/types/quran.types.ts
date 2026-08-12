// ─────────────────────────────────────────────────────────────────────────────
//  src/types/quran.types.ts
//  Strict TypeScript interfaces for Quran data.
//  Designed so that full external JSON datasets can replace sample files
//  seamlessly, and Flutter Dart models can map fields 1-to-1.
// ─────────────────────────────────────────────────────────────────────────────

/** Revelation type of a Surah */
export type RevelationType = 'Meccan' | 'Medinan';

/** Lightweight Surah metadata (used in the /surahs list endpoint) */
export interface SurahMeta {
  number: number;
  name: string;                    // Arabic name e.g. الفاتحة
  englishName: string;             // Transliteration e.g. Al-Faatiha
  englishNameTranslation: string;  // Meaning e.g. The Opening
  numberOfAyahs: number;
  revelationType: RevelationType;
}

/** A single Ayah within a Surah */
export interface Ayah {
  number: number;          // Global Ayah number (1-6236)
  numberInSurah: number;   // Position within the Surah
  text: string;            // Arabic text (Uthmani script)
  juz: number;             // Juz number (1-30)
  page: number;            // Mushaf page (1-604)
  hizbQuarter: number;     // Hizb quarter (1-240)
}

/** Full Surah detail including its Ayahs (used in /surahs/:id) */
export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
}

/** Shape of sample-surahs.json */
export interface SurahsJsonFile {
  surahs: SurahMeta[];
}

/** Shape of sample-quran-details.json */
export interface QuranDetailsJsonFile {
  surahs: SurahDetail[];
}

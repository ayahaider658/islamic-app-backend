// ─────────────────────────────────────────────────────────────────────────────
//  src/types/azkar.types.ts
//  Strict TypeScript interfaces for Azkar (Islamic remembrances).
// ─────────────────────────────────────────────────────────────────────────────

/** A single Dhikr item */
export interface DhikrItem {
  id: number;
  text: string;           // Arabic text
  translation: string;    // English translation
  transliteration: string;
  repetitions: number;    // Recommended number of repetitions
  benefit?: string;       // Optional — spiritual benefit / hadith note
  reference?: string;     // Optional — hadith reference
}

/** A category of Azkar */
export interface AzkarCategory {
  id: number;
  category: string;  // Display name e.g. "Morning Azkar"
  slug: string;      // URL-safe slug e.g. "morning"
  icon?: string;     // Optional icon identifier for Flutter UI
  items: DhikrItem[];
}

/** Shape of sample-azkar.json */
export interface AzkarJsonFile {
  azkar: AzkarCategory[];
}

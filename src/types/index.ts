export type Language = "en" | "ar" | "ur" | "id" | "hi" | "bn";

export type DisplayOption = "arabic" | "translation" | "transliteration";

export interface Translation {
  en: string;
  ur: string;
  id: string;
  hi: string;
  bn: string;
}

export interface Transliteration {
  en: string;
  ur: string;
  id: string;
  hi: string;
  bn: string;
}

export interface Dua {
  id: string;
  arabic: string;
  transliteration: Transliteration;
  translation: Translation;
  reference?: string;
  categoryId: string;
}

export interface Feeling {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  colorKey: string;
}

export interface UserPreferences {
  language: Language;
  displayOptions: DisplayOption[];
  theme: "light" | "dark" | "system";
  favorites: string[];
}

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  ar: "العربية",
  ur: "اردو",
  id: "Bahasa Indonesia",
  hi: "हिन्दी",
  bn: "বাংলা",
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: "en",
  displayOptions: ["arabic", "translation", "transliteration"],
  theme: "system",
  favorites: [],
};

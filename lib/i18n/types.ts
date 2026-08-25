export type Locale = "en" | "ru";

export const LOCALE_COOKIE = "titanik_locale";

export const ALL_LOCALES: Locale[] = ["en", "ru"];
export const DEFAULT_LOCALE: Locale = "en";

/** Player-facing text that must be authored in both supported languages. */
export interface LocalizedText {
  en: string;
  ru: string;
}

export function t(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text[DEFAULT_LOCALE];
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "ru";
}

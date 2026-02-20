import { uk as dateFnsUk } from "date-fns/locale";
import { enUS as dateFnsEn } from "date-fns/locale";
import { useLanguageStore, type Locale } from "@/lib/stores/language-store";
import { uk } from "./translations/uk";
import { en } from "./translations/en";
import type { TranslationStrings } from "./types";

export type { TranslationStrings, Locale };

const translations: Record<Locale, TranslationStrings> = { uk, en };

/**
 * Hook to get translations for the current locale.
 * Returns the full typed translation object and the current locale.
 */
export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  return {
    t: translations[locale],
    locale,
  };
}

/**
 * Get date-fns locale object for the current app locale.
 */
export function getDateFnsLocale(locale: Locale) {
  return locale === "en" ? dateFnsEn : dateFnsUk;
}

/**
 * Get the localized name for a holiday.
 * Returns nameEn for English locale, name (Ukrainian) otherwise.
 */
export function getHolidayName(
  holiday: { name: string; nameEn?: string },
  locale: Locale
): string {
  return locale === "en" && holiday.nameEn ? holiday.nameEn : holiday.name;
}

/**
 * Get the correct plural form of "day" for the given locale and count.
 */
export function getDaysWord(count: number, locale: Locale): string {
  if (locale === "en") {
    return count === 1 ? "day" : "days";
  }

  // Ukrainian pluralization
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "днів";
  }
  if (lastDigit === 1) {
    return "день";
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дні";
  }
  return "днів";
}

/**
 * Format "in X days" / "X days ago" / "today" / "tomorrow" for the given locale.
 */
export function formatDaysUntilLocalized(
  daysUntil: number,
  locale: Locale,
  t: TranslationStrings
): string {
  if (daysUntil === 0) {
    return t.time.today;
  }

  if (daysUntil === 1) {
    return t.time.tomorrow;
  }

  const word = getDaysWord(Math.abs(daysUntil), locale);

  if (daysUntil < 0) {
    const daysAgo = Math.abs(daysUntil);
    return t.time.daysAgo.replace("{count}", String(daysAgo)).replace("{days}", word);
  }

  return t.time.inDays.replace("{count}", String(daysUntil)).replace("{days}", word);
}

/**
 * Format a period string with days count for the given locale.
 * Example: "10 Feb - 28 Mar (47 days)"
 */
export function formatPeriodLocalized(
  startFormatted: string,
  endFormatted: string,
  daysCount: number,
  locale: Locale
): string {
  const word = getDaysWord(daysCount, locale);
  return `${startFormatted} - ${endFormatted} (${daysCount} ${word})`;
}

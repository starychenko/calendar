import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "uk" | "en";

declare global {
  interface Window {
    __FISCAL_LOCALE__?: Locale;
    __FISCAL_MODE__?: import("@/lib/stores/calendar-store").CalendarMode;
  }
}

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: "uk",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "fiscal-calendar-lang",
      version: 0,
      partialize: (state) => ({
        locale: state.locale,
      }),
      skipHydration: true,
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "uk" | "en";

declare global {
  interface Window {
    __FISCAL_LOCALE__?: Locale;
  }
}

function getInitialLocale(): Locale {
  if (typeof window !== "undefined" && window.__FISCAL_LOCALE__) {
    return window.__FISCAL_LOCALE__;
  }
  return "uk";
}

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: getInitialLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "fiscal-calendar-lang",
      version: 0,
      partialize: (state) => ({
        locale: state.locale,
      }),
    }
  )
);

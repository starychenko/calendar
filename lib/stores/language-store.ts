import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "uk" | "en";

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const getInitialLocale = (): Locale => {
  if (typeof document !== "undefined") {
    if (document.documentElement.lang === "en") return "en";
  }
  return "uk";
};

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

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage, storedField } from "../storage";

export type Locale = "uk" | "en";
interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
export const useLanguageStore = create<LanguageStore>()(
  persist((set) => ({ locale: "uk", setLocale: (locale) => set({ locale }) }), {
    name: "fiscal-calendar-lang",
    storage: createJSONStorage(() => safeStorage),
    partialize: (state) => ({ locale: state.locale }),
    skipHydration: true,
    merge: (persisted, current) => ({
      ...current,
      locale: storedField(persisted, "locale") === "en" ? "en" : "uk",
    }),
  }),
);

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage, storedField } from "../storage";

export type Theme = "light" | "dark" | "system";
interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
export const useThemeStore = create<ThemeStore>()(
  persist((set) => ({ theme: "system", setTheme: (theme) => set({ theme }) }), {
    name: "fiscal-calendar-theme",
    storage: createJSONStorage(() => safeStorage),
    partialize: (state) => ({ theme: state.theme }),
    skipHydration: true,
    merge: (persisted, current) => {
      const theme = storedField(persisted, "theme");
      return {
        ...current,
        theme: theme === "light" || theme === "dark" ? theme : "system",
      };
    },
  }),
);

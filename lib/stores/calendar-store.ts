import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage, storedField } from "../storage";

export type CalendarMode = "iso" | "gfk";
interface CalendarStore {
  mode: CalendarMode;
  year: number | null;
  navigationVisible: boolean;
  setMode: (mode: CalendarMode) => void;
  toggleMode: () => void;
  setYear: (year: number | null) => void;
  setNavigationVisible: (visible: boolean) => void;
}
export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      mode: "iso",
      year: null, // null follows the shared clock, including New Year's midnight.
      navigationVisible: false,
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "iso" ? "gfk" : "iso" })),
      setYear: (year) => {
        if (
          year === null ||
          (Number.isInteger(year) && year >= 1900 && year <= 2100)
        )
          set({ year });
      },
      setNavigationVisible: (navigationVisible) => set({ navigationVisible }),
    }),
    {
      name: "fiscal-calendar-mode",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ mode: state.mode }),
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        mode: storedField(persisted, "mode") === "gfk" ? "gfk" : "iso",
      }),
    },
  ),
);

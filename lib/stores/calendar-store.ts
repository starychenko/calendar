import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CalendarMode = "iso" | "gfk";

interface CalendarStore {
  mode: CalendarMode;
  year: number;
  navigationVisible: boolean;
  setMode: (mode: CalendarMode) => void;
  toggleMode: () => void;
  setYear: (year: number) => void;
  setNavigationVisible: (visible: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      mode: "iso",
      year: new Date().getFullYear(),
      navigationVisible: false,
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "iso" ? "gfk" : "iso",
        })),
      setYear: (year) => set({ year }),
      setNavigationVisible: (navigationVisible) => set({ navigationVisible }),
    }),
    {
      name: "fiscal-calendar-mode",
      partialize: (state) => ({
        mode: state.mode,
        // Don't persist year and navigationVisible
      }),
    }
  )
);

// Міграція: видалення застарілого ключа localStorage
if (typeof window !== "undefined") {
  const oldKey = "fiscal-calendar-storage";
  if (localStorage.getItem(oldKey)) {
    localStorage.removeItem(oldKey);
    if (process.env.NODE_ENV === "development") {
      console.log("Видалено застарілий localStorage ключ:", oldKey);
    }
  }
}

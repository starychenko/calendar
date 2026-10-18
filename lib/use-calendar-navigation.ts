"use client";
import { useToday } from "@/components/calendar-clock";
import { dateParts } from "./date-only";
import { useCalendarStore } from "./stores/calendar-store";

export function useCalendarNavigation() {
  const today = useToday();
  const selectedYear = useCalendarStore((s) => s.year);
  const setYear = useCalendarStore((s) => s.setYear);
  const mode = useCalendarStore((s) => s.mode);
  const toggleMode = useCalendarStore((s) => s.toggleMode);
  const year = selectedYear ?? dateParts(today).year;
  return {
    today,
    year,
    mode,
    toggleMode,
    previousYear: () => setYear(year - 1),
    nextYear: () => setYear(year + 1),
    currentYear: () => setYear(null),
  };
}

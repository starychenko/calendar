"use client";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { CalendarClock } from "@/components/calendar-clock";
import type { CalendarDate } from "@/lib/date-only";
import { useLanguageStore } from "@/lib/stores/language-store";
import { useCalendarStore } from "@/lib/stores/calendar-store";
import { useThemeStore } from "@/lib/stores/theme-store";

export function Providers({
  initialToday,
  children,
}: {
  initialToday: CalendarDate;
  children: React.ReactNode;
}) {
  const locale = useLanguageStore((s) => s.locale);
  useEffect(() => {
    void useLanguageStore.persist.rehydrate();
    void useCalendarStore.persist.rehydrate();
    void useThemeStore.persist.rehydrate();
    document.documentElement.dataset.appReady = "true";
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <CalendarClock initialToday={initialToday}>
      <ThemeProvider />
      {children}
    </CalendarClock>
  );
}

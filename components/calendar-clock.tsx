"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { todayDate, type CalendarDate } from "@/lib/date-only";

const ClockContext = createContext<CalendarDate | null>(null);
export function CalendarClock({
  initialToday,
  children,
}: {
  initialToday: CalendarDate;
  children: React.ReactNode;
}) {
  // The serialized server snapshot is also the first client snapshot.
  const [today, setToday] = useState(initialToday);
  useEffect(() => {
    const refresh = () => setToday(todayDate());
    refresh();
    const timer = window.setInterval(refresh, 15_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return (
    <ClockContext.Provider value={today}>{children}</ClockContext.Provider>
  );
}
export function useToday(): CalendarDate {
  const date = useContext(ClockContext);
  if (!date) throw new Error("CalendarClock provider is required");
  return date;
}

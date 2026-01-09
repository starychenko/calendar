"use client";

import { memo, useMemo } from "react";
import { CalendarMonth, WEEKDAY_NAMES_SHORT } from "@/lib/calendar";
import { WeekRow } from "./week-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  month: CalendarMonth;
  mode: "iso" | "gfk";
}

const MonthCalendarComponent = ({ month, mode }: MonthCalendarProps) => {
  // Memoize current date checks to avoid calling new Date() on every render
  const isCurrentMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return month.monthNumber === currentMonth && month.year === currentYear;
  }, [month.monthNumber, month.year]);

  // Add CSS containment for performance - isolates layout calculations
  const cardClassName = cn(
    // Базові класи (спільні для всіх місяців)
    "overflow-hidden hover:shadow-xl transition-shadow duration-300",
    "flex flex-col h-full p-0! gap-0!",
    "border-slate-200/60 dark:border-slate-700/60",
    "[contain:layout_style]",
    // Умовні класи для поточного місяця
    isCurrentMonth
      ? "ring-2 ring-slate-400/60 dark:ring-slate-500/60 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
      : "shadow-md"
  );

  const headerClassName = "py-3 px-4 relative shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center";

  return (
    <Card className={cardClassName}>
      <CardHeader className={headerClassName}>
        <span className="text-sm sm:text-base font-semibold capitalize tracking-wide text-slate-900 dark:text-slate-100">
          {month.name}
        </span>
      </CardHeader>
      <CardContent className="p-0! bg-linear-to-b from-slate-50/50 to-white dark:from-slate-900/30 dark:to-slate-950/50 flex-1 flex flex-col">
        {/* Заголовки стовпців */}
        <div className="grid grid-cols-8 bg-linear-to-b from-slate-100/80 to-slate-50/60 dark:from-slate-800/40 dark:to-slate-900/20 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="px-0.5 sm:px-1 py-1 sm:py-1.5 text-center border-r border-slate-300/50 dark:border-slate-600/50 bg-slate-100/70 dark:bg-slate-800/60 text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
            Тж
          </div>
          {WEEKDAY_NAMES_SHORT.map((day, index) => (
            <div
              key={day}
              className={cn(
                "px-0.5 sm:px-1 py-1 sm:py-1.5 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300",
                (index === 5 || index === 6) && "text-red-600 dark:text-red-400"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Тижні */}
        <div className="flex flex-col" role="grid" aria-label={`Календар на ${month.name} ${month.year}`}>
          {month.weeks.map((week, index) => (
            <WeekRow
              key={week.weekNumber}
              week={week}
              isLast={index === month.weeks.length - 1}
              mode={mode}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Memoize component to prevent unnecessary re-renders
// Only re-render if month or mode props change
export const MonthCalendar = memo(MonthCalendarComponent);

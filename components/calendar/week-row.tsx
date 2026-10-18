"use client";
import { memo } from "react";
import type { CalendarWeek } from "@/lib/calendar";
import type { CalendarDate } from "@/lib/date-only";
import type { Locale } from "@/lib/stores/language-store";
import { DayCell } from "./day-cell";
import { cn } from "@/lib/utils";

interface Props {
  week: CalendarWeek;
  isLast?: boolean;
  mode: "iso" | "gfk";
  today: CalendarDate;
  locale: Locale;
  todaySuffix: string;
  focusDate: CalendarDate;
}
export const WeekRow = memo(function WeekRow({
  week,
  isLast,
  mode,
  today,
  locale,
  todaySuffix,
  focusDate,
}: Props) {
  return (
    <div className="grid grid-cols-8" role="row">
      <div
        role="rowheader"
        className={cn(
          "aspect-square flex items-center justify-center text-[9px] sm:text-[10px] font-semibold bg-slate-100/80 dark:bg-slate-800/50 border-r border-slate-300/50 dark:border-slate-600/50 text-slate-600 dark:text-slate-400",
          !isLast && "border-b border-slate-200/40 dark:border-slate-700/40",
        )}
      >
        {week.weekNumber}
      </div>
      {week.days.map((day) => (
        <DayCell
          key={day.date}
          day={day}
          isLast={isLast}
          mode={mode}
          today={today}
          locale={locale}
          todaySuffix={todaySuffix}
          tabIndex={day.date === focusDate ? 0 : -1}
        />
      ))}
    </div>
  );
});

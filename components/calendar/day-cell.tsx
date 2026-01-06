"use client";

import { memo, useMemo } from "react";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDay } from "@/lib/calendar";
import { getHolidayForDate } from "@/lib/holidays";
import { HOLIDAY_STYLES, HOLIDAY_INDICATORS } from "@/lib/constants/holiday-styles";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayCellProps {
  day: CalendarDay;
  isLast?: boolean;
  mode: "iso" | "gfk";
}

const DayCellComponent = ({ day, isLast, mode }: DayCellProps) => {
  // Client-side check for current day (avoids build-time static value)
  const isToday = useMemo(() => isSameDay(day.date, new Date()), [day.date]);

  // Memoize expensive holiday lookup
  const holiday = useMemo(() => getHolidayForDate(day.date), [day.date]);
  const isHoliday = !!holiday;

  // Memoize holiday styles from constants
  const holidayStyles = useMemo(() => {
    return holiday ? HOLIDAY_STYLES[holiday.type] : "";
  }, [holiday]);

  // Memoize holiday indicator JSX
  const holidayIndicator = useMemo(() => {
    if (!holiday) return null;
    return <div className={HOLIDAY_INDICATORS[holiday.type]} />;
  }, [holiday]);

  // Memoize cell styles to avoid Tailwind IntelliSense conflicts
  const cellStyles = useMemo(() => {
    const baseStyles = "relative aspect-square flex flex-col items-center justify-center border-r last:border-r-0 border-slate-200/40 dark:border-slate-700/40 transition-[shadow,filter] duration-200";
    const borderBottom = !isLast ? "border-b" : "";

    if (isToday) {
      return cn(
        baseStyles,
        borderBottom,
        "ring-2 ring-inset ring-slate-500 dark:ring-slate-400 bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800/70 dark:to-slate-900/50 font-bold shadow-sm shadow-slate-400/20 dark:shadow-slate-600/30"
      );
    }

    if (isHoliday) {
      return cn(baseStyles, borderBottom, holidayStyles, "hover:brightness-95 dark:hover:brightness-110");
    }

    if (day.isWeekend) {
      return cn(
        baseStyles,
        borderBottom,
        "bg-linear-to-br from-red-50/50 to-red-50/30 dark:from-red-950/15 dark:to-red-950/5 hover:from-red-50/70 hover:to-red-50/50 dark:hover:from-red-950/25 dark:hover:to-red-950/15"
      );
    }

    return cn(baseStyles, borderBottom, "hover:bg-slate-50/60 dark:hover:bg-slate-800/30");
  }, [isToday, isHoliday, holidayStyles, day.isWeekend, isLast]);

  // Показуємо "фантомні" дні з інших місяців
  if (!day.isCurrentMonth) {
    return (
      <div
        role="gridcell"
        aria-label={`${day.day} ${day.date.toLocaleDateString('uk', { month: 'long' })}`}
        className={cn(
          "relative aspect-square flex flex-col items-center justify-center border-r last:border-r-0 border-slate-200/40 dark:border-slate-700/40",
          // У ISO режимі - сірі цифри, у GFK - звичайні
          mode === "iso" ? "text-muted-foreground/50" : "",
          "text-[10px] sm:text-xs",
          // У GFK режимі цифри також жирнуваті
          mode === "gfk" && "font-semibold",
          !isLast && "border-b"
        )}
      >
        <span>{day.day}</span>
      </div>
    );
  }

  const monthName = day.date.toLocaleDateString('uk', { month: 'long' });
  const ariaLabel = isHoliday
    ? `${day.day} ${monthName}, ${holiday.name}`
    : `${day.day} ${monthName}${isToday ? ', сьогодні' : ''}`;

  const cellContent = (
    <div
      className={cellStyles}
      role="gridcell"
      aria-label={ariaLabel}
      tabIndex={day.isCurrentMonth ? 0 : -1}
    >
      <span
        className={cn(
          "text-[10px] sm:text-xs font-semibold transition-colors",
          isHoliday && !isToday && "font-bold"
        )}
      >
        {day.day}
      </span>
      {isHoliday && !isToday && holidayIndicator}
    </div>
  );

  if (isHoliday) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={4}
          className="px-2 py-1 text-xs max-w-[calc(100vw-2rem)] sm:max-w-50"
        >
          <p className="truncate">{holiday.name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cellContent;
};

// Memoize component to prevent unnecessary re-renders
// Only re-render if day, isLast, or mode props change
export const DayCell = memo(DayCellComponent);

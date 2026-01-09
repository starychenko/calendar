"use client";

import { memo, useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDay } from "@/lib/calendar";
import { getHolidaysForDate } from "@/lib/holidays";
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
  // State for controlled tooltip (needed for mobile touch support)
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Client-side check for current day (avoids build-time static value)
  const isToday = useMemo(() => isSameDay(day.date, new Date()), [day.date]);

  // Memoize expensive holiday lookup - returns array of all holidays
  const holidays = useMemo(() => getHolidaysForDate(day.date), [day.date]);
  const isHoliday = holidays.length > 0;

  // First holiday has highest priority (used for styling and indicator)
  const primaryHoliday = holidays[0];

  // Memoize holiday styles from constants (based on primary holiday)
  const holidayStyles = useMemo(() => {
    return primaryHoliday ? HOLIDAY_STYLES[primaryHoliday.type] : "";
  }, [primaryHoliday]);

  // Memoize holiday indicator JSX (based on primary holiday)
  const holidayIndicator = useMemo(() => {
    if (!primaryHoliday) return null;
    return <div className={HOLIDAY_INDICATORS[primaryHoliday.type]} />;
  }, [primaryHoliday]);

  // Memoize cell styles to avoid Tailwind IntelliSense conflicts
  const cellStyles = useMemo(() => {
    const baseStyles = "relative aspect-square flex flex-col items-center justify-center border-r last:border-r-0 border-slate-200/40 dark:border-slate-700/40 transition-[shadow,filter] duration-200";
    const borderBottom = !isLast ? "border-b" : "";

    // Пріоритет стилів: свято + поточна дата > тільки свято > тільки поточна дата > вихідний > звичайний
    if (isHoliday && isToday) {
      // Комбінуємо стилі свята з рамкою поточної дати
      return cn(
        baseStyles,
        borderBottom,
        holidayStyles,
        "ring-2 ring-inset ring-slate-500 dark:ring-slate-400 font-bold shadow-sm shadow-slate-400/20 dark:shadow-slate-600/30 hover:brightness-95 dark:hover:brightness-110"
      );
    }

    if (isHoliday) {
      return cn(baseStyles, borderBottom, holidayStyles, "hover:brightness-95 dark:hover:brightness-110");
    }

    if (isToday) {
      return cn(
        baseStyles,
        borderBottom,
        "ring-2 ring-inset ring-slate-500 dark:ring-slate-400 bg-linear-to-br from-slate-100 to-slate-50 dark:from-slate-800/70 dark:to-slate-900/50 font-bold shadow-sm shadow-slate-400/20 dark:shadow-slate-600/30"
      );
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
    ? `${day.day} ${monthName}, ${holidays.map(h => h.name).join(', ')}`
    : `${day.day} ${monthName}${isToday ? ', сьогодні' : ''}`;

  // Handle click/touch to toggle tooltip on mobile devices
  const handleCellClick = () => {
    if (isHoliday) {
      setTooltipOpen((prev) => !prev);
    }
  };

  const cellContent = (
    <div
      className={cn(cellStyles, isHoliday && "cursor-pointer")}
      role="gridcell"
      aria-label={ariaLabel}
      tabIndex={day.isCurrentMonth ? 0 : -1}
      onClick={handleCellClick}
    >
      <span
        className={cn(
          "text-[10px] sm:text-xs font-semibold transition-colors",
          isHoliday && "font-bold"
        )}
      >
        {day.day}
      </span>
      {isHoliday && holidayIndicator}
    </div>
  );

  if (isHoliday) {
    return (
      <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
        <TooltipTrigger asChild>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={4}
          className="px-2.5 py-1.5 text-xs max-w-[calc(100vw-2rem)] sm:max-w-xs"
        >
          {holidays.length === 1 ? (
            <p>{holidays[0].name}</p>
          ) : (
            <ul className="space-y-0.5 list-none">
              {holidays.map((holiday, index) => (
                <li key={index}>{holiday.name}</li>
              ))}
            </ul>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return cellContent;
};

// Memoize component to prevent unnecessary re-renders
// Only re-render if day, isLast, or mode props change
export const DayCell = memo(DayCellComponent);

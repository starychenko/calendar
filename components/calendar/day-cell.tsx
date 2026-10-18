"use client";
import { memo, useState } from "react";
import type { CalendarDay } from "@/lib/calendar";
import { getHolidaysForDate } from "@/lib/holidays";
import { formatCalendarDate, type CalendarDate } from "@/lib/date-only";
import type { Locale } from "@/lib/stores/language-store";
import {
  HOLIDAY_STYLES,
  HOLIDAY_INDICATORS,
} from "@/lib/constants/holiday-styles";
import { getHolidayName } from "@/lib/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  day: CalendarDay;
  mode: "iso" | "gfk";
  isLast?: boolean;
  today: CalendarDate;
  locale: Locale;
  todaySuffix: string;
  tabIndex: number;
}
export const DayCell = memo(function DayCell({
  day,
  mode,
  isLast,
  today,
  locale,
  todaySuffix,
  tabIndex,
}: Props) {
  const [open, setOpen] = useState(false);
  const active = mode === "gfk" || day.isCurrentMonth;
  const holidays = active ? getHolidaysForDate(day.date) : [];
  const primary = holidays[0];
  const isToday = active && day.date === today;
  const label =
    formatCalendarDate(day.date, locale, "full") +
    (holidays.length
      ? ", " + holidays.map((h) => getHolidayName(h, locale)).join(", ")
      : "") +
    (isToday ? todaySuffix : "");
  const cell = (
    <div
      role="gridcell"
      data-calendar-date={active ? day.date : undefined}
      aria-label={label}
      aria-current={isToday ? "date" : undefined}
      tabIndex={active ? tabIndex : -1}
      className={cn(
        "relative aspect-square flex items-center justify-center border-r last:border-r-0 border-slate-200/40 dark:border-slate-700/40 text-[10px] sm:text-xs",
        !isLast && "border-b",
        active ? "font-semibold" : "text-muted-foreground/60",
        active &&
          "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary",
        primary
          ? HOLIDAY_STYLES[primary.type]
          : active && day.isWeekend
            ? "bg-red-50/50 dark:bg-red-950/15"
            : "",
        isToday &&
          "ring-2 ring-inset ring-slate-500 dark:ring-slate-400 font-bold",
        primary &&
          "cursor-pointer hover:brightness-95 dark:hover:brightness-110",
      )}
      onClick={(event) => {
        if (primary) {
          event.preventDefault();
          setOpen(true);
        }
      }}
      onKeyDown={(event) => {
        if (primary && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setOpen(true);
        }
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <span>{day.day}</span>
      {primary && <div className={HOLIDAY_INDICATORS[primary.type]} />}
    </div>
  );
  return primary ? (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>{cell}</TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={4}
        className="px-2.5 py-1.5 text-xs max-w-[calc(100vw-2rem)] sm:max-w-xs"
      >
        {holidays.map((h) => (
          <p key={h.type + h.name}>{getHolidayName(h, locale)}</p>
        ))}
      </TooltipContent>
    </Tooltip>
  ) : (
    cell
  );
});

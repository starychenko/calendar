"use client";
import { memo, useState, type KeyboardEvent } from "react";
import type { CalendarMonth } from "@/lib/calendar";
import type { CalendarDate } from "@/lib/date-only";
import { useToday } from "@/components/calendar-clock";
import { WeekRow } from "./week-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export const MonthCalendar = memo(function MonthCalendar({
  month,
  mode,
}: {
  month: CalendarMonth;
  mode: "iso" | "gfk";
}) {
  const { t, locale } = useTranslation();
  const today = useToday();
  const [focused, setFocused] = useState<CalendarDate | null>(null);
  const active = month.weeks
    .flatMap((w) => w.days)
    .filter((d) => mode === "gfk" || d.isCurrentMonth);
  const containsToday = active.some((d) => d.date === today);
  const focusDate =
    active.find((d) => d.date === focused)?.date ??
    (containsToday ? today : active[0].date);
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const keys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];
    if (!keys.includes(event.key)) return;
    const cells = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[data-calendar-date]"),
    );
    const index = cells.indexOf(event.target as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    let next =
      index +
      ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key] ??
        0);
    if (event.key === "Home" || event.key === "End") {
      const row = Array.from(
        (event.target as HTMLElement)
          .closest('[role="row"]')!
          .querySelectorAll<HTMLElement>("[data-calendar-date]"),
      );
      next = cells.indexOf(event.key === "Home" ? row[0] : row[row.length - 1]);
    }
    cells[Math.max(0, Math.min(cells.length - 1, next))].focus();
  }
  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full p-0! gap-0! border-slate-200/60 dark:border-slate-700/60 [contain:layout_style]",
        containsToday
          ? "ring-2 ring-slate-400/60 dark:ring-slate-500/60 shadow-lg"
          : "shadow-md",
      )}
    >
      <CardHeader className="py-3 px-4 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <h2 className="text-sm sm:text-base font-semibold capitalize tracking-wide text-slate-900 dark:text-slate-100">
          {month.name}
        </h2>
      </CardHeader>
      <CardContent className="p-0! bg-linear-to-b from-slate-50/50 to-white dark:from-slate-900/30 dark:to-slate-950/50 flex-1">
        <div
          role="grid"
          aria-label={t.calendar.calendarFor
            .replace("{month}", month.name)
            .replace("{year}", String(month.year))}
          onKeyDown={navigate}
          onFocus={(e) => {
            const date = (e.target as HTMLElement).dataset.calendarDate as
              CalendarDate | undefined;
            if (date) setFocused(date);
          }}
        >
          <div
            role="row"
            className="grid grid-cols-8 bg-slate-100/80 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-700/50"
          >
            <div
              role="columnheader"
              className="py-1 text-center text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              {t.calendar.weekAbbr}
            </div>
            {t.calendar.weekdays.map((day, i) => (
              <div
                role="columnheader"
                key={day}
                className={cn(
                  "py-1 text-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300",
                  i > 4 && "text-red-600 dark:text-red-400",
                )}
              >
                {day}
              </div>
            ))}
          </div>
          {month.weeks.map((week, i) => (
            <WeekRow
              key={week.weekNumber}
              week={week}
              isLast={i === month.weeks.length - 1}
              mode={mode}
              today={today}
              locale={locale}
              todaySuffix={t.aria.todaySuffix}
              focusDate={focusDate}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

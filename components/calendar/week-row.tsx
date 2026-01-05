"use client";

import { memo } from "react";
import { CalendarWeek } from "@/lib/calendar";
import { DayCell } from "./day-cell";
import { cn } from "@/lib/utils";

interface WeekRowProps {
  week: CalendarWeek;
  isLast?: boolean;
  mode: "iso" | "gfk";
}

const WeekRowComponent = ({ week, isLast, mode }: WeekRowProps) => {
  const baseWeekCellClasses = "aspect-square flex items-center justify-center text-[9px] sm:text-[10px] font-semibold bg-linear-to-br from-slate-100/80 to-slate-50/60 dark:from-slate-800/50 dark:to-slate-900/30 border-r border-slate-300/50 dark:border-slate-600/50 text-slate-600 dark:text-slate-400";

  const weekCellClassName = cn(
    baseWeekCellClasses,
    !isLast && "border-b border-slate-200/40 dark:border-slate-700/40"
  );

  return (
    <div className="grid grid-cols-8" role="row">
      <div className={weekCellClassName}>
        {week.weekNumber}
      </div>
      {week.days.map((day, index) => (
        <DayCell key={`${day.date.toISOString()}-${index}`} day={day} isLast={isLast} mode={mode} />
      ))}
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const WeekRow = memo(WeekRowComponent);

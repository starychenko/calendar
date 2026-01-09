"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getUpcomingHolidays,
  getTodayHolidays,
  formatShortDate,
  formatPeriod,
  getDaysUntilHoliday,
  formatDaysUntil,
  type HolidayGroup,
} from "@/lib/upcoming-holidays";
import { HOLIDAY_STYLES } from "@/lib/constants/holiday-styles";

// Zustand store для збереження стану панелі
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HolidaysPanelStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const useHolidaysPanelStore = create<HolidaysPanelStore>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "holidays-panel-state",
    }
  )
);

/**
 * Debounce функція для оптимізації resize обробника
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Отримати поточну дату без часу (для порівняння)
 */
function getCurrentDateKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

export function FloatingHolidays() {
  const { isOpen, setIsOpen } = useHolidaysPanelStore();
  const [isMobile, setIsMobile] = useState(false);
  const [currentDateKey, setCurrentDateKey] = useState(getCurrentDateKey);

  // Оновлюємо дату кожну хвилину для автоматичного оновлення свят о півночі
  useEffect(() => {
    const interval = setInterval(() => {
      const newDateKey = getCurrentDateKey();
      if (newDateKey !== currentDateKey) {
        setCurrentDateKey(newDateKey);
      }
    }, 60000); // Перевірка кожну хвилину

    return () => clearInterval(interval);
  }, [currentDateKey]);

  // Дебаунс для resize обробника
  const debouncedCheckMobile = useRef(
    debounce(() => {
      setIsMobile(window.innerWidth < 1024);
    }, 150)
  ).current;

  // Визначаємо мобільний пристрій з debounce
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener("resize", debouncedCheckMobile);
    return () => window.removeEventListener("resize", debouncedCheckMobile);
  }, [debouncedCheckMobile]);

  // На мобільних завжди закрито за замовчуванням
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  // Мемоізація з залежністю від дати для автоматичного оновлення
  const todayHolidays = useMemo(() => getTodayHolidays(), [currentDateKey]);
  const upcomingHolidays = useMemo(() => getUpcomingHolidays(60), [currentDateKey]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "fixed bottom-6 left-6 z-50",
            "flex items-center justify-center gap-2",
            // Мобільні: кругла кнопка тільки з іконкою
            "w-14 h-14 lg:w-auto lg:h-auto lg:px-4 lg:py-3",
            // Кольори з адаптацією під тему
            "bg-white dark:bg-slate-800",
            "text-slate-700 dark:text-slate-200",
            "border-2 border-slate-300 dark:border-slate-600",
            // Тіні та ефекти
            "shadow-lg hover:shadow-xl dark:shadow-slate-900/50",
            "rounded-full",
            // Анімації та переходи
            "transition-all duration-300 ease-out",
            "hover:scale-105 hover:border-slate-400 dark:hover:border-slate-500",
            "active:scale-95",
            // Додаткові ефекти
            "backdrop-blur-sm",
            // Ховається при відкритті
            isOpen && "scale-0 opacity-0 pointer-events-none"
          )}
          aria-label="Відкрити список свят"
        >
          <Calendar className="w-5 h-5 shrink-0" />
          <span className="hidden lg:inline font-semibold text-sm whitespace-nowrap">
            Свята
          </span>
          {todayHolidays.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
              {todayHolidays.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side={isMobile ? "bottom" : "left"}
        className={cn(
          "p-0 flex flex-col",
          isMobile ? "h-[80vh] rounded-t-2xl" : "w-100",
          // Покращені анімації
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          isMobile
            ? "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
            : "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "duration-300"
        )}
      >
        <SheetHeader className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-bold">
                🎉 Свята України
              </SheetTitle>
              <SheetDescription className="text-sm">
                Поточні та найближчі свята
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Свята сьогодні */}
          {todayHolidays.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                Сьогодні • {formatShortDate(new Date())}
              </h3>
              <div className="space-y-3 lg:space-y-2">
                {todayHolidays.map((holiday) => (
                  <HolidayCard
                    key={`today-${holiday.name}-${holiday.date?.getTime()}`}
                    holiday={holiday}
                    isToday
                  />
                ))}
              </div>
            </div>
          )}

          {/* Найближчі свята */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Найближчі свята
            </h3>
            {upcomingHolidays.length > 0 ? (
              <div className="space-y-3 lg:space-y-2">
                {upcomingHolidays.map((holiday) => (
                  <HolidayCard
                    key={`upcoming-${holiday.name}-${
                      holiday.isPeriod
                        ? holiday.startDate?.getTime()
                        : holiday.date?.getTime()
                    }`}
                    holiday={holiday}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                Немає найближчих свят на наступні 60 днів
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface HolidayCardProps {
  holiday: HolidayGroup;
  isToday?: boolean;
}

const HolidayCard = React.memo(function HolidayCard({
  holiday,
  isToday,
}: HolidayCardProps) {
  const bgStyle = HOLIDAY_STYLES[holiday.type];

  // Мемоізація розрахунків днів до свята
  const { daysUntilText, dateText } = useMemo(() => {
    const holidayDate = holiday.isPeriod ? holiday.startDate! : holiday.date!;
    const daysUntil = getDaysUntilHoliday(holidayDate);

    const dateText =
      holiday.isPeriod && holiday.startDate && holiday.endDate && holiday.daysCount
        ? formatPeriod(holiday.startDate, holiday.endDate, holiday.daysCount)
        : holiday.date
        ? formatShortDate(holiday.date)
        : "";

    return {
      daysUntilText: formatDaysUntil(daysUntil),
      dateText,
    };
  }, [holiday]);

  return (
    <div
      className={cn(
        "p-3 rounded-lg border",
        bgStyle,
        isToday && "ring-2 ring-blue-500 dark:ring-blue-400",
        "hover:shadow-md transition-shadow duration-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="w-2 h-2 rounded-full bg-current" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            {holiday.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{dateText}</p>
          {!isToday && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-500 mt-1 italic">
              {daysUntilText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

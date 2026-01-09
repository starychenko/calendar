"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Calendar, ChevronRight, ChevronLeft, X } from "lucide-react";
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
      isOpen: false, // За замовчуванням закрито (анімація покажеться при першому завантаженні)
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
  const [showHint, setShowHint] = useState(false);

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
  }, [isMobile, isOpen, setIsOpen]);

  // Показуємо підказку при першому візиті (тільки на десктопах коли панель закрита)
  useEffect(() => {
    // Перевіряємо, чи вже показували підказку
    const hintShown = localStorage.getItem("holidays-panel-hint-shown");

    // Перевіряємо налаштування accessibility (зменшення руху)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hintShown && !isMobile && !isOpen && !prefersReducedMotion) {
      // Показуємо підказку через 2 секунди після завантаження
      const timer = setTimeout(() => {
        setShowHint(true);

        // Приховуємо підказку через 3 секунди
        const hideTimer = setTimeout(() => {
          setShowHint(false);
          localStorage.setItem("holidays-panel-hint-shown", "true");
        }, 3000);

        return () => clearTimeout(hideTimer);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isMobile, isOpen]);

  // Мемоізація з залежністю від дати для автоматичного оновлення
  const todayHolidays = useMemo(() => getTodayHolidays(), [currentDateKey]);
  const upcomingHolidays = useMemo(() => getUpcomingHolidays(60), [currentDateKey]);

  const handleToggle = () => {
    // Завжди встановлюємо маркер при будь-якій взаємодії користувача
    // Це запобігає показу анімації навіть якщо користувач клікнув до її запуску
    localStorage.setItem("holidays-panel-hint-shown", "true");

    setIsOpen(!isOpen);

    // Приховуємо підказку якщо вона активна
    if (showHint) {
      setShowHint(false);
    }
  };

  // Мобільна версія - Sheet знизу
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "fixed bottom-6 left-6 z-50",
              "flex items-center justify-center",
              "w-14 h-14",
              "bg-white dark:bg-card",
              "text-slate-700 dark:text-foreground",
              "border-2 border-slate-300 dark:border-border",
              "shadow-lg hover:shadow-xl dark:shadow-black/50",
              "rounded-full",
              "transition-all duration-300 ease-out",
              "hover:scale-105 hover:border-slate-400 dark:hover:border-border/80",
              "active:scale-95",
              "backdrop-blur-sm",
              isOpen && "scale-0 opacity-0 pointer-events-none"
            )}
            aria-label="Відкрити список свят"
          >
            <Calendar className="w-5 h-5 shrink-0" />
            {todayHolidays.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {todayHolidays.length}
              </span>
            )}
          </button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className={cn(
            "p-0 flex flex-col h-[80vh] rounded-t-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "duration-300"
          )}
        >
          <HolidayPanelContent
            todayHolidays={todayHolidays}
            upcomingHolidays={upcomingHolidays}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Десктопна версія - Fixed панель зліва
  return (
    <>
      {/* Кнопка toggle для десктопу */}
      <button
        onClick={handleToggle}
        className={cn(
          "fixed top-24 z-40 transition-all duration-300",
          isOpen ? "left-90" : "left-0",
          "flex items-center justify-center",
          "w-10 h-16",
          "bg-white dark:bg-card",
          "text-slate-600 dark:text-foreground",
          "border-2 border-l-0 border-slate-200 dark:border-border",
          "rounded-r-lg",
          "shadow-lg dark:shadow-black/50",
          "hover:bg-slate-50 dark:hover:bg-accent",
          "hover:text-slate-900 dark:hover:text-accent-foreground",
          "group",
          // Анімація підказки - язичок підстрибує вправо як м'ячик
          showHint && "animate-bounce-hint"
        )}
        aria-label={isOpen ? "Закрити панель свят" : "Відкрити панель свят"}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        ) : (
          <>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            {todayHolidays.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {todayHolidays.length}
              </span>
            )}
          </>
        )}
      </button>

      {/* Десктопна панель */}
      <div
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] z-30",
          "w-90",
          "bg-white dark:bg-card",
          "border-r-2 border-slate-200 dark:border-border",
          "shadow-2xl dark:shadow-black/50",
          "flex flex-col",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <HolidayPanelContent
          todayHolidays={todayHolidays}
          upcomingHolidays={upcomingHolidays}
          isDesktop
        />
      </div>
    </>
  );
}

interface HolidayPanelContentProps {
  todayHolidays: HolidayGroup[];
  upcomingHolidays: HolidayGroup[];
  onClose?: () => void;
  isDesktop?: boolean;
}

function HolidayPanelContent({
  todayHolidays,
  upcomingHolidays,
  onClose,
  isDesktop,
}: HolidayPanelContentProps) {
  return (
    <>
      {!isDesktop && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Свята України
              </h2>
              <p className="text-sm text-muted-foreground">
                Поточні та найближчі свята
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={cn(
        "flex-1 overflow-y-auto px-6 space-y-6",
        isDesktop ? "py-6" : "py-4"
      )}>
        {/* Свята сьогодні */}
        {todayHolidays.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Сьогодні • {formatShortDate(new Date())}
            </h3>
            <div className="space-y-2">
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
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Найближчі свята
          </h3>
          {upcomingHolidays.length > 0 ? (
            <div className="space-y-2">
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
            <p className="text-sm text-muted-foreground italic">
              Немає найближчих свят на наступні 60 днів
            </p>
          )}
        </div>
      </div>
    </>
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
          <h4 className="font-semibold text-sm text-foreground">
            {holiday.name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">{dateText}</p>
          {!isToday && (
            <p className="text-xs font-medium text-muted-foreground mt-1 italic">
              {daysUntilText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

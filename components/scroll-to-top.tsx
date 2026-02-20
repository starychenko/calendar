"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const lastProgress = useRef(0);

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY;
    const visible = scrollY > 300;

    // Обчислити прогрес прокрутки
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
    const progress = Math.min(Math.max(scrolled, 0), 100);

    // Оновлювати стан тільки якщо значення змінились (уникаємо зайвих рендерів)
    if (Math.abs(lastScrollY.current - scrollY) > 10 || (visible && Math.abs(lastProgress.current - progress) > 0.5)) {
      lastScrollY.current = scrollY;
      lastProgress.current = progress;
      setIsVisible(visible);
      setScrollProgress(progress);
    } else if (visible !== isVisible) {
      setIsVisible(visible);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      // Використовуємо requestAnimationFrame для оптимізації
      if (rafId.current !== null) {
        return;
      }

      rafId.current = requestAnimationFrame(() => {
        updateScrollState();
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Перевірити початковий стан (через queueMicrotask щоб уникнути synchronous setState в effect)
    queueMicrotask(updateScrollState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [updateScrollState]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Обчислити stroke-dashoffset для кругового прогресу
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(scrollProgress, 0), 100); // Обмежити 0-100
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Прокрутити вгору"
      className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-[opacity,transform,shadow] duration-300 hover:scale-110 flex items-center justify-center ${
        isVisible
          ? "opacity-100 translate-y-0 [will-change:transform,opacity]"
          : "opacity-0 translate-y-10 pointer-events-none [will-change:auto]"
      }`}
    >
        {/* Круговий прогрес індикатор */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 48 48"
        >
          {/* Фоновий круг */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="opacity-20"
          />
          {/* Прогрес круг */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary-foreground"
            style={{ transition: 'none' }}
          />
        </svg>

        {/* Іконка стрілки */}
        <ArrowUp className="h-5 w-5 relative z-10" />
    </button>
  );
}

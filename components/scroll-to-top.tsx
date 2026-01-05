"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;

      // Показувати кнопку після прокрутки на 300px
      setIsVisible(scrollY > 300);

      // Обчислити прогрес прокрутки
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = windowHeight > 0 ? (scrollY / windowHeight) * 100 : 0;
      setScrollProgress(Math.min(Math.max(scrolled, 0), 100));
    };

    const handleScroll = () => {
      // Використовуємо requestAnimationFrame для throttling
      if (rafId.current !== null) {
        return;
      }

      rafId.current = requestAnimationFrame(() => {
        updateScrollState();
        rafId.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollState(); // Перевірити початковий стан

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

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
      className={`fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-[opacity,transform,shadow] duration-300 hover:scale-110 flex items-center justify-center ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
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
            className="transition-all duration-75 text-primary-foreground"
          />
        </svg>

        {/* Іконка стрілки */}
        <ArrowUp className="h-5 w-5 relative z-10" />
    </button>
  );
}

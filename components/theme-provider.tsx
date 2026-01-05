"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/lib/stores/theme-store";

export function ThemeProvider() {
  // Локальний стейт для відстеження системної теми (не зберігаємо в Zustand)
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Отримати вибір користувача з Zustand
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Обчислити фінальну тему
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  // Ініціалізація localStorage при першому завантаженні
  useEffect(() => {
    const stored = localStorage.getItem("fiscal-calendar-theme");
    if (!stored) {
      // Створити запис з дефолтною темою
      setTheme("system");
    }
  }, [setTheme]);

  // Відстежувати зміни системної теми
  useEffect(() => {
    const updateSystemTheme = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setSystemTheme(isDark ? "dark" : "light");
    };

    // Встановити початкову системну тему
    updateSystemTheme();

    // Слухати зміни системної теми
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  // Застосувати тему до DOM
  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
  }, [resolvedTheme]);

  // Компонент нічого не рендерить
  return null;
}

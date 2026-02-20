"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useLanguageStore } from "@/lib/stores/language-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  return (
    <>
      <ThemeProvider />
      {children}
    </>
  );
}

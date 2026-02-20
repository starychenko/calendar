"use client";

import { useTranslation } from "@/lib/i18n";

export function SkipToMain() {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t.common.skipToMain}
    </a>
  );
}

/**
 * Environment variables and configuration
 */

/**
 * Валідувати та нормалізувати URL
 * @param url - URL для валідації
 * @returns Валідний URL без trailing slash
 */
function validateSiteUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Видаляємо trailing slash і повертаємо origin + pathname
    return parsed.toString().replace(/\/$/, "");
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[Env] Invalid NEXT_PUBLIC_SITE_URL: "${url}". Using fallback: http://localhost:3000`
      );
    }
    return "http://localhost:3000";
  }
}

export const SITE_URL = validateSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
);

// В production обов'язково має бути вказаний SITE_URL
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.error(
    "[Env] NEXT_PUBLIC_SITE_URL is not set in production. SEO metadata may be incorrect."
  );
}

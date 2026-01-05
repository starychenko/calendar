import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * Google Analytics integration using @next/third-parties
 *
 * Features:
 * - Automatic page view tracking
 * - Optimized script loading (lazy loaded, non-blocking)
 * - Only loads in production when GA_ID is provided
 * - Privacy-friendly (respects user's Do Not Track settings)
 *
 * Setup:
 * 1. Create Google Analytics 4 property at https://analytics.google.com
 * 2. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 3. Set environment variable: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Only load Google Analytics in production with valid GA_ID
  if (!gaId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}

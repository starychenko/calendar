import type { Metadata } from "next";
import { YearCalendar } from "@/components/calendar/year-calendar";
import { SEOContent } from "@/components/seo-content";
import { FloatingHolidays } from "@/components/floating-holidays";

// The layout supplies a request-specific initial date for stable hydration.

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <div className="bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-16 xl:px-12 2xl:px-10 3xl:px-96 pt-6 md:pt-8 pb-12 max-w-screen-3xl">
        <YearCalendar />
        <SEOContent />
      </div>
      <FloatingHolidays />
    </div>
  );
}

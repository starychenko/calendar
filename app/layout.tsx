import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { connection } from "next/server";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@/components/analytics";
import { SkipToMain } from "@/components/skip-to-main";
import { SITE_URL } from "@/lib/env";
import { todayDate } from "@/lib/date-only";

const inter = localFont({
  display: "swap",
  src: [
    {
      path: "../public/fonts/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-cyrillic-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-cyrillic-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/inter-cyrillic-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};
const title = "Фіскальний календар України: ISO 8601, GfK та свята";
const description =
  "Календар з номерами ISO-тижнів, фіскальними періодами GfK і вибраними святами України. Перегляд років 1900-2100 українською та англійською.";
export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(SITE_URL),
  applicationName: "Фіскальний календар України",
  openGraph: {
    title,
    description,
    siteName: "Фіскальний календар України",
    locale: "uk_UA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // A request-specific date and CSP nonce must never come from a long-lived HTML cache.
  await connection();
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var p=JSON.parse(localStorage.getItem('fiscal-calendar-theme')||'null');var t=p&&p.state&&p.state.theme;var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.toggle('dark',matchMedia('(prefers-color-scheme:dark)').matches);}})();",
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers initialToday={todayDate()}>
          <SkipToMain />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ScrollToTop />
          <Analytics nonce={nonce} />
        </Providers>
      </body>
    </html>
  );
}

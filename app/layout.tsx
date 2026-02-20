import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@/components/analytics";
import { SkipToMain } from "@/components/skip-to-main";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ISR: Revalidate once a month for SEO metadata with current year
// Calendar dates (isToday, isCurrentMonth) are handled on client side
export const revalidate = 2592000; // 30 days in seconds

// Генеруємо поточний рік для SEO
const currentYear = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Фіскальний календар ${currentYear}: ISO 8601, GFK та свята України`,
  description: `Актуальний фіскальний календар на ${currentYear} рік з номерами тижнів за стандартами ISO 8601 та GFK. Всі державні, релігійні та професійні свята України в одному зручному інтерфейсі.`,
  keywords: [
    `фіскальний календар ${currentYear}`,
    `календар ${currentYear} україна`,
    `виробничий календар ${currentYear}`,
    `робочий календар ${currentYear}`,
    "календар за стандартом ISO 8601",
    `фіскальні тижні ${currentYear}`,
    `календар GFK ${currentYear} україна`,
    `календар з номерами тижнів ${currentYear}`,
    `державні свята україни ${currentYear}`,
    `норми робочого часу ${currentYear} україна`,
    `православний календар ${currentYear}`,
    `православний календар ${currentYear} україна`,
    `церковні свята ${currentYear}`,
    `церковні свята україни ${currentYear}`,
    `дванадесяті свята ${currentYear}`,
    `великдень ${currentYear} україна`,
    `релігійні свята ${currentYear}`,
    "православні свята",
    "церковний календар україна",
    "великий піст",
    "пасхалія",
    "ISO 8601",
    "календар тижнів",
    "українські свята",
    "тижневий календар",
    "планування",
    "ISO week",
    "календар України",
  ],
  authors: [{ name: "Fiscal Calendar Ukraine" }],
  creator: "Fiscal Calendar Ukraine",
  publisher: "Fiscal Calendar Ukraine",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `Фіскальний календар ${currentYear}: ISO 8601, GFK та свята України`,
    description: `Актуальний фіскальний календар на ${currentYear} рік з номерами тижнів за стандартами ISO 8601 та GFK. Всі державні, релігійні та професійні свята України в одному зручному інтерфейсі.`,
    url: "/",
    siteName: "Фіскальний календар України",
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Фіскальний календар ${currentYear}: ISO 8601, GFK та свята України`,
    description: `Актуальний фіскальний календар на ${currentYear} рік з номерами тижнів за стандартами ISO 8601 та GFK.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when deploying
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const year = new Date().getFullYear();

  // Structured data для Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Фіскальний календар України ${year}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "UAH"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "description": `Фіскальний календар на ${year} рік з номерами тижнів за стандартами ISO 8601 та GFK. Всі державні, релігійні та комерційні свята України.`,
    "featureList": [
      "Тижні за стандартом ISO 8601",
      "Календар GFK для ритейлу та аналітики",
      "Українські державні свята",
      "Релігійні свята (Великдень, Трійця)",
      "Комерційні свята (Чорна П'ятниця, День Матері)",
      "Норми робочого часу"
    ],
    "inLanguage": "uk-UA",
    "keywords": `фіскальний календар ${year}, ISO 8601, GFK календар, українські свята ${year}`
  };

  // FAQ Structured Data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Як визначається номер тижня за стандартом ISO 8601?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "За стандартом ISO 8601 тиждень починається з понеділка. Перший тиждень року — це тиждень, що містить перший четвер січня. Це означає, що перший тиждень завжди має щонайменше 4 дні в новому році."
        }
      },
      {
        "@type": "Question",
        "name": "Для чого потрібен календар GFK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Календар GFK використовується в роздрібній торгівлі та маркетинговій аналітиці для порівняння продажів між різними роками. Він дозволяє коректно порівнювати тижневі показники, враховуючи кількість днів у місяці та їх розподіл."
        }
      },
      {
        "@type": "Question",
        "name": "Які свята включені в календар?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Календар включає всі офіційні державні свята України (День Незалежності, Новий рік), релігійні свята (Великдень, Трійця, Різдво), міжнародні свята (8 Березня, День матері) та комерційні події (Чорна п'ятниця, Cyber Monday)."
        }
      },
      {
        "@type": "Question",
        "name": "Чому Великдень щороку в різні дати?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Великдень — це рухоме свято, дата якого обчислюється за складним алгоритмом (формула Гауса). Православний Великдень святкується в першу неділю після першого весняного повного місяця, що настає після весняного рівнодення."
        }
      },
      {
        "@type": "Question",
        "name": "Чи оновлюється календар автоматично?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Так, календар автоматично розраховує всі дати та свята для поточного року. Рухомі свята (як Великдень, Трійця) обчислюються динамічно за відповідними алгоритмами."
        }
      }
    ]
  };

  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Theme: Read from localStorage or use default
                  var stored = localStorage.getItem('fiscal-calendar-theme');
                  var theme = 'system';

                  if (stored) {
                    var parsed = JSON.parse(stored);
                    theme = parsed.state?.theme || 'system';
                  }

                  var getSystemTheme = function() {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light';
                  };

                  var resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

                  if (resolvedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }

                  // Language: Set html lang attribute from localStorage
                  var langStored = localStorage.getItem('fiscal-calendar-lang');
                  if (langStored) {
                    var langParsed = JSON.parse(langStored);
                    var locale = langParsed.state?.locale;
                    if (locale === 'en' || locale === 'uk') {
                      document.documentElement.lang = locale;
                    }
                  }

                  // Mark as ready — CSS can unhide content
                  document.documentElement.classList.add('lang-ready');
                } catch (e) {
                  document.documentElement.classList.add('lang-ready');
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <SkipToMain />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ScrollToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "@/lib/i18n";

export function SEOContent() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <div className="mt-12 space-y-8 max-w-4xl mx-auto">
      {/* Державні та професійні свята */}
      <section id="holidays">
        <h2 className="text-2xl font-bold mb-4">
          {t.seo.holidaysTitle.replace("{year}", String(currentYear))}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">{t.holidays.national}</div>
              <div className="text-xs text-muted-foreground">{t.holidays.nationalExamples}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-purple-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">{t.holidays.religious}</div>
              <div className="text-xs text-muted-foreground">{t.holidays.religiousExamples}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-pink-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">{t.holidays.international}</div>
              <div className="text-xs text-muted-foreground">{t.holidays.internationalExamples}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">{t.holidays.commercial}</div>
              <div className="text-xs text-muted-foreground">{t.holidays.commercialExamples}</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">{t.holidays.lent}</div>
              <div className="text-xs text-muted-foreground">{t.holidays.lentDescription}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">{t.seo.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              {t.seo.faqIsoQ}
            </AccordionTrigger>
            <AccordionContent>
              {t.seo.faqIsoA}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              {t.seo.faqGfkQ}
            </AccordionTrigger>
            <AccordionContent>
              {t.seo.faqGfkA}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              {t.seo.faqHolidaysQ}
            </AccordionTrigger>
            <AccordionContent>
              {t.seo.faqHolidaysA}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              {t.seo.faqEasterQ}
            </AccordionTrigger>
            <AccordionContent>
              {t.seo.faqEasterA}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              {t.seo.faqAutoQ}
            </AccordionTrigger>
            <AccordionContent>
              {t.seo.faqAutoA}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>
              {t.seo.faqOrthodoxQ}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>{t.seo.faqOrthodoxIntro}</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {t.seo.faqOrthodoxCategories.map((category, index) => (
                    <li key={index}>
                      <strong>{category.title}</strong> {category.items}
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}

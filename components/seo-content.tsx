"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SEOContent() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-12 space-y-8 max-w-4xl mx-auto">
      {/* Державні та професійні свята */}
      <section id="holidays">
        <h2 className="text-2xl font-bold mb-4">
          Державні та професійні свята в {currentYear} році
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Національні</div>
              <div className="text-xs text-muted-foreground">День Незалежності, Новий рік</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-purple-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Релігійні</div>
              <div className="text-xs text-muted-foreground">Великдень, Трійця, Різдво</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-pink-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Міжнародні</div>
              <div className="text-xs text-muted-foreground">День жінок, День матері</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Комерційні</div>
              <div className="text-xs text-muted-foreground">Чорна п'ятниця, Cyber Monday</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Часті запитання</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Як визначається номер тижня за стандартом ISO 8601?
            </AccordionTrigger>
            <AccordionContent>
              За стандартом ISO 8601 тиждень починається з понеділка. Перший тиждень року — це
              тиждень, що містить перший четвер січня. Це означає, що перший тиждень завжди має
              щонайменше 4 дні в новому році. Такий підхід забезпечує, що кожен рік має повних
              52 або 53 тижні.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Для чого потрібен календар GFK?
            </AccordionTrigger>
            <AccordionContent>
              Календар GFK використовується в роздрібній торгівлі та маркетинговій аналітиці для
              порівняння продажів між різними роками. Він дозволяє коректно порівнювати тижневі
              показники, враховуючи кількість днів у місяці та їх розподіл. Це особливо важливо
              для планування акцій, рекламних кампаній та прогнозування попиту.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Які свята включені в календар?
            </AccordionTrigger>
            <AccordionContent>
              Календар включає всі офіційні державні свята України (День Незалежності, Новий рік),
              релігійні свята (Великдень, Трійця, Різдво), міжнародні свята (8 Березня, День матері)
              та комерційні події (Чорна п'ятниця, Cyber Monday). Кожен тип свята позначений своїм
              кольором для зручності планування.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Чому Великдень щороку в різні дати?
            </AccordionTrigger>
            <AccordionContent>
              Великдень — це рухоме свято, дата якого обчислюється за складним алгоритмом (формула Гауса).
              Православний Великдень святкується в першу неділю після першого весняного повного місяця,
              що настає після весняного рівнодення. Через це дата може змінюватись у межах з 4 квітня
              до 8 травня. Від дати Великодня залежать і інші релігійні свята, наприклад Трійця
              (49 днів після Великодня).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              Чи оновлюється календар автоматично?
            </AccordionTrigger>
            <AccordionContent>
              Так, календар автоматично розраховує всі дати та свята для поточного року. Рухомі свята
              (як Великдень, Трійця) обчислюються динамічно за відповідними алгоритмами. Це гарантує,
              що ви завжди маєте актуальну інформацію незалежно від року.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <div className="text-xs text-muted-foreground">Великдень, Трійця, Івана Купала, Спас</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-pink-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Міжнародні</div>
              <div className="text-xs text-muted-foreground">День жінок, День Валентина</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Комерційні</div>
              <div className="text-xs text-muted-foreground">Чорна п'ятниця, Cyber Monday</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <div className="w-3 h-3 rounded-full bg-slate-400 mt-1.5 shrink-0" />
            <div>
              <div className="font-medium text-sm">Великий піст</div>
              <div className="text-xs text-muted-foreground">48-денний період підготовки до Великодня</div>
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
              Календар включає всі офіційні державні свята України, повний православний календар
              (31+ свято, включаючи дванадесяті свята, Великдень, Трійцю, Івана Купала, Спас та
              інші), міжнародні свята та комерційні події. Великий піст позначається окремо як
              48-денний період. Всього понад 70 важливих дат для планування протягом року. Кожен
              тип свята позначений своїм кольором для зручності планування.
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

          <AccordionItem value="item-6">
            <AccordionTrigger>
              Які православні свята включені в календар?
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Календар включає повний православний календар України:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong>Дванадесяті свята:</strong> Богоявлення, Стрітення, Благовіщення,
                    Вознесіння, Трійця, Преображення (Яблучний Спас), Успіння, Різдво Богородиці,
                    Воздвиження, Введення в храм
                  </li>
                  <li>
                    <strong>Великі свята:</strong> Великдень (Пасха), Різдво Христове
                  </li>
                  <li>
                    <strong>Дні пам'яті святих:</strong> Святого Юрія, Апостолів Петра і Павла,
                    Святого Миколая
                  </li>
                  <li>
                    <strong>Народні релігійні свята:</strong> Івана Купала, Щедрий вечір (Маланки)
                  </li>
                  <li>
                    <strong>Рухомі свята:</strong> Прощена неділя, Вербна неділя, Великдень,
                    Вознесіння, Трійця (розраховуються автоматично за церковним календарем)
                  </li>
                  <li>
                    <strong>Великий піст:</strong> 48-денний період перед Великоднем позначений
                    окремо
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { SITE_URL } from "@/lib/env";

const currentYear = new Date().getFullYear();

// ISR: Revalidate once a month for SEO metadata
export const revalidate = 2592000; // 30 days in seconds

export const metadata: Metadata = {
  title: `Умови використання | Фіскальний календар України ${currentYear}`,
  description:
    "Умови використання веб-застосунку Фіскальний календар України. Правила користування, ліцензія Apache 2.0, відмова від гарантій.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-16 xl:px-12 2xl:px-10 3xl:px-96 max-w-screen-3xl py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <Calendar className="h-4 w-4" />
            Повернутися до календаря
          </Link>
          <h1 className="text-4xl font-bold mb-4">Умови використання</h1>
          <p className="text-muted-foreground">
            Остання редакція: {new Date().toLocaleDateString("uk-UA")}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Прийняття умов</h2>
            <p className="text-muted-foreground leading-relaxed">
              Використовуючи веб-застосунок "Фіскальний календар України" (далі — Застосунок), доступний за адресою{" "}
              <a href={SITE_URL} className="text-primary hover:underline">
                {SITE_URL.replace(/^https?:\/\//, "")}
              </a>
              , ви погоджуєтесь дотримуватися цих Умов використання (далі — Умови). Якщо ви не згодні з цими Умовами, будь ласка, не
              користуйтесь Застосунком.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Опис послуги</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Застосунок надає безкоштовний інструмент для перегляду фіскальних календарів України з такими функціями:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Відображення номерів тижнів за стандартом ISO 8601</li>
              <li>Відображення номерів тижнів за методологією GfK</li>
              <li>Інформація про українські національні, релігійні та міжнародні свята</li>
              <li>Комерційні дати (Чорна п'ятниця, Кіберпонеділок)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Застосунок призначений для інформаційних цілей та не є офіційним джерелом юридичної або фінансової інформації.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Безкоштовне використання</h2>
            <p className="text-muted-foreground leading-relaxed">
              Застосунок надається безкоштовно для особистого та комерційного використання. Ми не вимагаємо реєстрації, оплати чи будь-яких
              інших зобов'язань з вашого боку.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Інтелектуальна власність</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Вихідний код Застосунку поширюється під ліцензією{" "}
              <a
                href="https://www.apache.org/licenses/LICENSE-2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Apache License 2.0
              </a>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Це означає, що ви можете:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Використовувати код в комерційних та некомерційних проектах</li>
              <li>Модифікувати та адаптувати код під свої потреби</li>
              <li>Розповсюджувати оригінальний або модифікований код</li>
              <li>Використовувати патенти, якщо такі є</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              За умови, що ви:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Зберігаєте повідомлення про авторські права та ліцензію</li>
              <li>Вказуєте всі зміни у коді (якщо такі є)</li>
              <li>Включаєте копію ліцензії Apache 2.0 у будь-які розповсюджувані версії</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Повний текст ліцензії доступний у репозиторії проекту:{" "}
              <a
                href="https://github.com/starychenko/calendar/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/starychenko/calendar
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Заборонене використання</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Під час використання Застосунку ви зобов'язуєтесь НЕ:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Використовувати Застосунок для незаконних цілей</li>
              <li>Намагатися отримати несанкціонований доступ до серверів чи мережевої інфраструктури</li>
              <li>Здійснювати атаки типу DDoS або перевантажувати сервери</li>
              <li>Впроваджувати шкідливий код (віруси, троянські програми тощо)</li>
              <li>Порушувати права інтелектуальної власності</li>
              <li>Видавати Застосунок за власну розробку без належного зазначення ліцензії</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Відмова від гарантій</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">
                ЗАСТОСУНОК НАДАЄТЬСЯ "ЯК Є" БЕЗ БУДЬ-ЯКИХ ГАРАНТІЙ, ЯВНИХ ЧИ НЕЯВНИХ.
              </strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ми не гарантуємо:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Безперебійну роботу Застосунку</li>
              <li>Відсутність помилок чи неточностей у даних</li>
              <li>Точність дат святкових днів (рекомендуємо перевіряти офіційні джерела)</li>
              <li>Придатність для конкретних цілей</li>
              <li>Відповідність вашим очікуванням</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Інформація про свята та фіскальні тижні надається виключно в інформаційних цілях. Для прийняття важливих бізнес-рішень
              рекомендуємо звертатися до офіційних джерел.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Обмеження відповідальності</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ми не несемо відповідальності за:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Прямі чи непрямі збитки, викликані використанням або неможливістю використання Застосунку</li>
              <li>Втрату даних, прибутків чи можливостей</li>
              <li>Рішення, прийняті на основі інформації з Застосунку</li>
              <li>Технічні збої, простої серверів чи проблеми з доступом до Застосунку</li>
              <li>Дії третіх осіб (хакерські атаки, витік даних тощо)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Максимальна відповідальність у будь-якому випадку обмежується сумою 0 (нуль) гривень, оскільки Застосунок надається
              безкоштовно.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Посилання на треті сторони</h2>
            <p className="text-muted-foreground leading-relaxed">
              Застосунок може містити посилання на зовнішні веб-сайти (LinkedIn, Telegram, GitHub). Ми не контролюємо ці ресурси та не несемо
              відповідальності за їх зміст, політику конфіденційності чи практики.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Зміни до Умов</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ми залишаємо за собою право змінювати ці Умови у будь-який час. Дата останньої редакції вказана на початку документа. Продовження
              використання Застосунку після внесення змін означає ваше прийняття оновлених Умов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Припинення доступу</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ми залишаємо за собою право призупинити або припинити доступ до Застосунку у будь-який час без попереднього повідомлення, зокрема
              у випадках порушення цих Умов.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Застосовне право</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ці Умови регулюються законодавством України. Будь-які спори, що виникають у зв'язку з використанням Застосунку, підлягають
              вирішенню у відповідності з чинним законодавством України.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Контактна інформація</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Якщо у вас виникли питання щодо цих Умов використання, ви можете зв'язатися з нами:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                Telegram:{" "}
                <a href="https://t.me/evgeniistarychenko" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @evgeniistarychenko
                </a>
              </li>
              <li>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/yevhenii-starychenko-016313149/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Yevhenii Starychenko
                </a>
              </li>
              <li>
                GitHub:{" "}
                <a href="https://github.com/starychenko/calendar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  starychenko/calendar
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Роздільність положень</h2>
            <p className="text-muted-foreground leading-relaxed">
              Якщо будь-яке положення цих Умов буде визнано недійсним чи таким, що не підлягає виконанню, решта положень залишаються в силі.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

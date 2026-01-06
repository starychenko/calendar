import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { SITE_URL } from "@/lib/env";

const currentYear = new Date().getFullYear();

// ISR: Revalidate once a month for SEO metadata
export const revalidate = 2592000; // 30 days in seconds

export const metadata: Metadata = {
  title: `Політика конфіденційності | Фіскальний календар України ${currentYear}`,
  description:
    "Політика конфіденційності веб-застосунку Фіскальний календар України. Інформація про захист персональних даних та використання localStorage.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-4">Політика конфіденційності</h1>
          <p className="text-muted-foreground">
            Остання редакція: {new Date().toLocaleDateString("uk-UA")}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Загальна інформація</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Веб-застосунок "Фіскальний календар України" (далі — Застосунок) доступний за адресою{" "}
              <a href={SITE_URL} className="text-primary hover:underline">
                {SITE_URL.replace(/^https?:\/\//, "")}
              </a>{" "}
              та надає користувачам безкоштовний інструмент для перегляду фіскальних тижнів за стандартами ISO 8601 та GfK, а також
              українських свят.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ми поважаємо вашу конфіденційність та прагнемо забезпечити максимальний захист ваших даних. Ця Політика
              конфіденційності пояснює, як ми обробляємо інформацію під час використання Застосунку.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Збір даних</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.1. Персональні дані</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Застосунок НЕ збирає персональні ідентифікаційні дані.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ми не вимагаємо реєстрації, не запитуємо ім'я, електронну пошту, номер телефону чи будь-яку іншу особисту інформацію. Ви
              можете користуватися Застосунком без надання персональних даних.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2. Аналітичні дані (Google Analytics)</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Для покращення якості Застосунку ми використовуємо Google Analytics 4 — сервіс веб-аналітики від Google LLC.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Google Analytics автоматично збирає наступні <strong className="text-foreground">неперсоніфіковані</strong> дані:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>IP-адреса (анонімізована)</li>
              <li>Тип пристрою та операційна система</li>
              <li>Браузер та його версія</li>
              <li>Переглянуті сторінки та час перебування на них</li>
              <li>Географічне розташування (країна, місто)</li>
              <li>Джерело переходу (звідки ви прийшли на сайт)</li>
              <li>Взаємодія з елементами сторінки (кліки, скролінг)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ці дані використовуються виключно для:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Розуміння, як користувачі взаємодіють з Застосунком</li>
              <li>Покращення функціональності та користувацького досвіду</li>
              <li>Виправлення технічних проблем</li>
              <li>Аналізу трафіку та популярності функцій</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong className="text-foreground">Важливо:</strong> Google Analytics збирає дані анонімно та не ідентифікує вас особисто. IP-адреси
              анонімізуються (останній октет видаляється) перед збереженням.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Використання localStorage</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Для покращення зручності використання Застосунок зберігає ваші налаштування у локальному сховищі браузера (localStorage):
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Вибраний режим календаря (ISO 8601 або GfK)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ці дані зберігаються виключно на вашому пристрої та НЕ передаються на сервер. Ви можете видалити ці налаштування у будь-який
              час, очистивши дані сайту у налаштуваннях вашого браузера.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Cookies (файли cookie)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Застосунок використовує cookies виключно для Google Analytics. Ми НЕ встановлюємо власних cookies для відстеження або реклами.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.1. Google Analytics Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Google Analytics встановлює наступні cookies для збору аналітичних даних:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong className="text-foreground">_ga</strong> - ідентифікує унікальних відвідувачів (термін дії: 2 роки)
              </li>
              <li>
                <strong className="text-foreground">_ga_*</strong> - зберігає стан сесії (термін дії: 2 роки)
              </li>
              <li>
                <strong className="text-foreground">_gid</strong> - розрізняє користувачів (термін дії: 24 години)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2. Керування Cookies</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ви можете заблокувати або видалити cookies через налаштування вашого браузера:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Chrome: Налаштування → Конфіденційність та безпека → Файли cookie</li>
              <li>Firefox: Налаштування → Приватність і захист → Файли cookie</li>
              <li>Safari: Налаштування → Конфіденційність → Керувати даними веб-сайту</li>
              <li>Edge: Налаштування → Файли cookie та дозволи сайтів</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ви також можете відмовитися від Google Analytics за допомогою{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                офіційного браузерного розширення Google Analytics Opt-out
              </a>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong className="text-foreground">Увага:</strong> Блокування cookies не вплине на функціональність Застосунку, але ми не зможемо
              отримувати аналітичні дані для покращення сервісу.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Передача даних третім сторонам</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Застосунок використовує наступні сторонні сервіси:
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.1. Google Analytics (Google LLC)</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Аналітичні дані, зібрані через Google Analytics, передаються та обробляються компанією Google LLC (США). Google використовує ці дані
              відповідно до власної{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Політики конфіденційності
              </a>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Google може використовувати зібрані дані для покращення власних сервісів та показу персоналізованої реклами на інших сайтах
              (якщо ви увійшли в обліковий запис Google).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Детальніше про використання даних Google Analytics:{" "}
              <a
                href="https://support.google.com/analytics/answer/6004245"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                How Google uses data when you use our partners' sites or apps
              </a>
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2. Зовнішні посилання</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Застосунок містить посилання на зовнішні ресурси. Ці посилання ведуть на треті платформи, які мають
              власні політики конфіденційності:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  LinkedIn Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Telegram Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  GitHub Privacy Statement
                </a>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ми не несемо відповідальності за політику конфіденційності та практики цих сторонніх сервісів.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Безпека даних</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ми вживаємо заходів для захисту ваших даних:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Застосунок НЕ збирає персональні ідентифікаційні дані</li>
              <li>Налаштування зберігаються виключно на вашому пристрої (localStorage)</li>
              <li>Google Analytics використовує анонімізацію IP-адрес</li>
              <li>З'єднання з Google Analytics захищене HTTPS протоколом</li>
              <li>Дані передаються тільки уповноваженим третім сторонам (Google)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Google LLC вживає власних заходів безпеки для захисту даних відповідно до міжнародних стандартів (GDPR, CCPA).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Права користувачів</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Відповідно до Загального регламенту про захист даних (GDPR) та Закону України "Про захист персональних даних", ви маєте право на:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Доступ до своїх персональних даних (не застосовується, оскільки ми не збираємо дані)</li>
              <li>Виправлення або видалення даних (не застосовується)</li>
              <li>Обмеження обробки (не застосовується)</li>
              <li>Перенесення даних (не застосовується)</li>
              <li>Заперечення проти обробки (не застосовується)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Оскільки ми не обробляємо персональні дані, ці права не потребують реалізації у контексті нашого Застосунку.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Зміни до Політики конфіденційності</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ми залишаємо за собою право оновлювати цю Політику конфіденційності. Дата останньої редакції вказана на початку документа. Будь-які
              зміни набувають чинності з моменту публікації оновленої версії на цій сторінці.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Контактна інформація</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Якщо у вас виникли питання щодо цієї Політики конфіденційності, ви можете зв'язатися з нами:
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
        </div>
      </div>
    </div>
  );
}

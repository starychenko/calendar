import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Фіскальний календар України",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Політика конфіденційності", url: "/privacy" },
  description:
    "Налаштування браузера, аналітика та керування даними у Фіскальному календарі України.",
};

export default function PrivacyPage() {
  return (
    <div
      lang="uk"
      className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-16 xl:px-12 2xl:px-10 3xl:px-96 max-w-screen-3xl py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <Calendar className="h-4 w-4" />
            Повернутися до календаря
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">
            Політика конфіденційності
          </h1>
          <p className="text-muted-foreground">Остання редакція: 18.10.2026</p>
        </div>
        <div className="space-y-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p+p]:mt-4 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-muted-foreground">
          <section>
            <h2>1. Про застосунок</h2>
            <p>
              Фіскальний календар України доступний за адресою{" "}
              <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, "")}</a>.
              Календар не має реєстрації, особистих кабінетів або форм для
              введення імені, електронної пошти чи номера телефону.
            </p>
            <p>
              Відсутність реєстрації не означає відсутності технічної обробки
              даних: під час відкриття сайту браузер надсилає мережеві запити до
              інфраструктури сайту, а за увімкненої аналітики - також до Google.
            </p>
          </section>
          <section>
            <h2>2. Аналітика</h2>
            <p>
              Якщо аналітику увімкнено для сайту, використовується Google
              Analytics 4. Події можуть містити відомості про переглянуту
              сторінку, зміну року, режиму календаря, мови чи теми. Google також
              може обробляти дані браузера, пристрою, джерела переходу та
              мережевого запиту.
            </p>
            <p>
              Аналітика допомагає оцінювати використання функцій і виявляти
              проблеми. Її фактична обробка, строки зберігання та передача даних
              залежать від налаштувань сервісу і{" "}
              <a
                href="https://support.google.com/analytics/answer/6004245"
                target="_blank"
                rel="noopener noreferrer"
              >
                правил Google Analytics
              </a>
              .
            </p>
            <p>
              Застосунок не завантажує аналітику, якщо браузер передає
              увімкнений Do Not Track або Global Privacy Control. Відключення
              аналітики не перешкоджає роботі календаря.
            </p>
          </section>
          <section>
            <h2>3. Локальні налаштування</h2>
            <p>У localStorage браузера зберігаються:</p>
            <ul>
              <li>режим календаря ISO або GfK;</li>
              <li>мова та тема оформлення;</li>
              <li>стан панелі свят і факт показу підказки.</li>
            </ul>
            <p>
              Ці записи потрібні для відновлення інтерфейсу після
              перезавантаження. Їх можна видалити, очистивши дані сайту в
              браузері. Якщо доступ до сховища заборонений, календар працює без
              збереження налаштувань. За увімкненої аналітики події зміни
              налаштувань можуть окремо надсилатися до Google.
            </p>
          </section>
          <section>
            <h2>4. Файли cookie</h2>
            <p>
              Сам календар використовує localStorage для налаштувань. Google
              Analytics може встановлювати аналітичні cookie; їхній склад і
              строк дії залежать від конфігурації сервісу.
            </p>
            <p>
              Cookie можна заблокувати або видалити в налаштуваннях браузера.
              Для відключення аналітики також доступне{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                розширення Google Analytics Opt-out
              </a>
              . Блокування cookie саме по собі не гарантує припинення всіх
              мережевих запитів.
            </p>
          </section>
          <section>
            <h2>5. Зовнішні сервіси</h2>
            <p>
              За увімкненої аналітики дані передаються Google відповідно до його{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                політики конфіденційності
              </a>
              . Посилання на Telegram, LinkedIn і GitHub відкривають сторонні
              сайти, де діють їхні власні правила.
            </p>
          </section>
          <section>
            <h2>6. Захист даних</h2>
            <p>
              Календар не потребує пароля чи облікового запису. Запити до Google
              Analytics використовують HTTPS. Налаштування інтерфейсу
              залишаються в браузері до видалення даних сайту; вимкнення доступу
              до localStorage обробляється без зупинки календаря.
            </p>
          </section>
          <section>
            <h2>7. Керування даними та звернення</h2>
            <p>
              Ви можете очистити дані сайту, обмежити cookie або увімкнути
              підтримуваний браузером сигнал DNT/GPC. Із запитаннями про обробку
              даних, доступ до них або їх видалення звертайтеся за контактами
              нижче. Відсутність реєстрації не скасовує прав, передбачених
              застосовним законодавством.
            </p>
          </section>
          <section>
            <h2>8. Зміни політики</h2>
            <p>
              Цю сторінку оновлюємо разом зі змінами в обробці даних. Дата
              редакції наведена на початку документа.
            </p>
          </section>
          <section>
            <h2>9. Контакти</h2>
            <ul>
              <li>
                Telegram:{" "}
                <a
                  href="https://t.me/evgeniistarychenko"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @evgeniistarychenko
                </a>
              </li>
              <li>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/yevhenii-starychenko-016313149/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Yevhenii Starychenko
                </a>
              </li>
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/starychenko/calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

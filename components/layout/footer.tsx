"use client";

import Link from "next/link";
import { Calendar, Github, Linkedin, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-8 sm:px-10 md:px-12 lg:px-16 xl:px-12 2xl:px-10 3xl:px-96 max-w-screen-3xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* About section */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">{t.common.fiscalCalendar}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4 md:text-right md:flex md:flex-col md:items-end">
            <h3 className="font-semibold text-sm">{t.footer.contacts}</h3>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href="https://www.linkedin.com/in/yevhenii-starychenko-016313149/"
                onClick={() =>
                  trackEvent({
                    event: "outbound_click",
                    social_network: "linkedin",
                    url: "https://www.linkedin.com/in/yevhenii-starychenko-016313149/",
                  })
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://t.me/evgeniistarychenko"
                onClick={() =>
                  trackEvent({
                    event: "outbound_click",
                    social_network: "telegram",
                    url: "https://t.me/evgeniistarychenko",
                  })
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Telegram</span>
              </a>
              <a
                href="https://github.com/starychenko/calendar"
                onClick={() =>
                  trackEvent({
                    event: "outbound_click",
                    social_network: "github",
                    url: "https://github.com/starychenko/calendar",
                  })
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright.replace("{year}", String(currentYear))}
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

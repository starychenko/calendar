import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  errors.set(page, []);
  page.on("pageerror", (error) => errors.get(page)!.push(error.message));
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { calendarCspViolations: violations });
    document.addEventListener("securitypolicyviolation", (event) =>
      violations.push(event.violatedDirective + ": " + event.blockedURI),
    );
  });
  await page.route(/google-analytics\.com|googletagmanager\.com/, (route) =>
    route.abort(),
  );
  await page.clock.install({ time: new Date("2026-10-18T09:00:00Z") });
});
test.afterEach(async ({ page }, info) => {
  if (!info.title.includes("unavailable JavaScript")) {
    expect(errors.get(page), "uncaught browser errors").toEqual([]);
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { calendarCspViolations?: string[] })
            .calendarCspViolations ?? [],
      ),
      "CSP violations",
    ).toEqual([]);
  }
});
async function ready(page: Page, path = "/") {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-app-ready", "true");
}
const main = (page: Page) => page.getByRole("main");
const day = (page: Page, date: string) =>
  main(page).locator('[data-calendar-date="' + date + '"]');

test("calendar navigation and GfK include the 53rd week and cross-month holidays", async ({
  page,
}) => {
  await ready(page);
  await expect(main(page).getByRole("grid")).toHaveCount(12);
  await main(page)
    .getByRole("button", { name: "GFK режим", exact: true })
    .click();
  await expect(
    main(page).getByRole("rowheader", { name: "53", exact: true }),
  ).toHaveCount(1);
  await expect(day(page, "2027-01-03")).toHaveCount(1);
  await expect(day(page, "2026-08-24")).toHaveAttribute(
    "aria-label",
    /незалежності/i,
  );
  await day(page, "2026-08-24").hover();
  await expect(page.getByRole("tooltip")).toContainText(/незалежності/i);
  await day(page, "2026-08-24").click();
  await expect(page.getByRole("tooltip")).toContainText(/незалежності/i);
  await page.keyboard.press("Escape");
  await main(page)
    .getByRole("button", { name: "Наступний рік", exact: true })
    .click();
  await expect(main(page).getByRole("grid").first()).toHaveAttribute(
    "aria-label",
    /2027/,
  );
  await main(page)
    .getByRole("button", { name: "Сьогодні", exact: true })
    .click();
  await expect(main(page).getByRole("grid").first()).toHaveAttribute(
    "aria-label",
    /2026/,
  );
});
test("saved English, GfK and dark theme survive a reload", async ({ page }) => {
  await ready(page);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await main(page)
    .getByRole("button", { name: "GFK mode", exact: true })
    .click();
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.getByRole("menuitem", { name: "Dark", exact: true }).click();
  await ready(page);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(day(page, "2027-01-03")).toHaveCount(1);
});
test("midnight updates today without navigation or reload", async ({
  page,
}) => {
  await page.clock.setSystemTime(new Date("2026-10-18T20:59:30Z"));
  await ready(page);
  await expect(day(page, "2026-10-18")).toHaveAttribute("aria-current", "date");
  await page.clock.fastForward(90_000);
  await expect(day(page, "2026-10-19")).toHaveAttribute("aria-current", "date");
  await expect(day(page, "2026-10-18")).not.toHaveAttribute(
    "aria-current",
    "date",
  );
});
test("New Year follows the clock while explicit year navigation stays selected", async ({
  page,
}) => {
  await page.clock.setSystemTime(new Date("2026-12-31T21:59:30Z"));
  await ready(page);
  await page.clock.fastForward(90_000);
  await expect(main(page).getByRole("grid").first()).toHaveAttribute(
    "aria-label",
    /2027/,
  );
  await main(page)
    .getByRole("button", { name: "Попередній рік", exact: true })
    .click();
  await page.clock.fastForward(86_400_000);
  await expect(main(page).getByRole("grid").first()).toHaveAttribute(
    "aria-label",
    /2026/,
  );
});
test("SSR hydrates correctly even when browser date differs from the server", async ({
  page,
}) => {
  await page.clock.setSystemTime(new Date("2030-01-01T10:00:00Z"));
  await ready(page);
  await expect(day(page, "2030-01-01")).toHaveAttribute("aria-current", "date");
});
test("invalid persisted preferences recover without an application error", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "fiscal-calendar-lang",
      '{"state":{"locale":"xx"},"version":0}',
    );
    localStorage.setItem(
      "fiscal-calendar-mode",
      '{"state":{"mode":{},"year":9999},"version":0}',
    );
    localStorage.setItem("fiscal-calendar-theme", "{invalid");
    localStorage.setItem(
      "holidays-panel-state",
      '{"state":{"isOpen":"yes"},"version":0}',
    );
  });
  await ready(page);
  await expect(main(page).getByRole("grid")).toHaveCount(12);
  await expect(
    page.getByRole("button", { name: "Switch to English" }),
  ).toBeVisible();
});
test("denied browser storage leaves navigation usable", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    }),
  );
  await ready(page);
  await main(page)
    .getByRole("button", { name: "Наступний рік", exact: true })
    .click();
  await expect(main(page).getByRole("grid").first()).toHaveAttribute(
    "aria-label",
    /2027/,
  );
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
test("unavailable JavaScript does not hide server-rendered content", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "fiscal-calendar-lang",
      '{"state":{"locale":"en"},"version":0}',
    ),
  );
  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(main(page).getByRole("grid")).toHaveCount(12);
});
test("calendar uses one tab stop per grid with arrow and row navigation", async ({
  page,
}) => {
  await ready(page);
  await expect(
    main(page).locator('[role="gridcell"][tabindex="0"]'),
  ).toHaveCount(12);
  await day(page, "2026-01-02").focus();
  await page.keyboard.press("ArrowRight");
  await expect(day(page, "2026-01-03")).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(day(page, "2026-01-10")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(day(page, "2026-01-05")).toBeFocused();
  await page.keyboard.press("End");
  await expect(day(page, "2026-01-11")).toBeFocused();
});
test("hidden header and scroll controls cannot receive tab focus", async ({
  page,
}) => {
  await ready(page);
  const previous = page.locator("header").getByRole("button", {
    name: "Попередній рік",
    exact: true,
    includeHidden: true,
  });
  await expect(previous.locator("xpath=..")).toBeAttached();
  await expect(page.locator("header [inert]")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const invisible = await page.evaluate(() => {
    const e = document.activeElement as HTMLElement;
    return !!e.closest("[inert]") || getComputedStyle(e).opacity === "0";
  });
  expect(invisible).toBe(false);
});
for (const width of [320, 375, 390, 768, 1440]) {
  test("layout remains within the viewport at " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(
      page.getByRole("button", { name: "Перемкнути тему" }),
    ).toBeInViewport();
    await page.getByRole("button", { name: "Switch to English" }).click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}
test("mobile holiday dialog has an accessible name and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const open = page.getByRole("button", {
    name: "Відкрити список свят",
    exact: true,
  });
  await open.click();
  await expect(
    page.getByRole("dialog", { name: "Свята України" }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
});
test("desktop calendar and dark theme pass accessibility checks", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await ready(page);
  for (const dark of [false, true]) {
    if (dark) {
      await page.getByRole("button", { name: "Перемкнути тему" }).click();
      await page.getByRole("menuitem", { name: "Темна", exact: true }).click();
      await expect(page.locator("html")).toHaveClass(/dark/);
    }
    // Exercise the whole page before scanning. WebKit defers inherited color
    // recalculation in offscreen content until it enters the viewport.
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.getByRole("grid").first().scrollIntoViewIfNeeded();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
test("legal pages have self canonical, truthful metadata and Ukrainian body language", async ({
  page,
}) => {
  for (const path of ["/privacy", "/terms"]) {
    await page.setViewportSize({ width: 320, height: 844 });
    await ready(page, path);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://127.0.0.1:19118" + path,
    );
    expect(
      await page.locator('script[type="application/ld+json"]').count(),
    ).toBe(0);
    if (path === "/privacy")
      await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(main(page).locator('[lang="uk"]')).toBeVisible();
    await expect(main(page)).toContainText("18.10.2026");
  }
});
test("DNT prevents Analytics script injection", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "doNotTrack", {
      value: "1",
      configurable: true,
    }),
  );
  await ready(page);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await main(page)
    .getByRole("button", { name: "Наступний рік", exact: true })
    .click();
  expect(await page.evaluate(() => Object.hasOwn(window, "dataLayer"))).toBe(
    false,
  );
});
test("GPC prevents Analytics script injection", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: true,
      configurable: true,
    }),
  );
  await ready(page);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect(await page.evaluate(() => Object.hasOwn(window, "dataLayer"))).toBe(
    false,
  );
});
test("Analytics initializes when configured and privacy signals are absent", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "doNotTrack", {
      value: "0",
      configurable: true,
    });
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: false,
      configurable: true,
    });
  });
  await ready(page);
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => Object.hasOwn(window, "dataLayer")))
    .toBe(true);
});
test("metadata routes and PNG work without a font CDN", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
  }
  const response = await request.get("/opengraph-image");
  expect(response.status()).toBe(200);
  const bytes = await response.body();
  expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual([1200, 630]);
});
test("production responses use a fresh nonce and security headers", async ({
  request,
}) => {
  const a = await request.get("/"),
    b = await request.get("/");
  expect(a.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(a.headers()["content-security-policy"]).not.toEqual(
    b.headers()["content-security-policy"],
  );
  expect(a.headers()["x-content-type-options"]).toBe("nosniff");
  expect(a.headers()["x-frame-options"]).toBe("DENY");
  expect(a.headers()["cache-control"]).not.toContain("s-maxage=2592000");
});

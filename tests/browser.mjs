import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = "http://127.0.0.1:3000";
try {
  await page.goto(base + "/?verify=2#/masters");
  await page
    .getByRole("button", { name: "Открыть: Мастер 01", exact: true })
    .waitFor();
  assert.equal(await page.locator(".portrait").count(), 10);
  const bounds = await page.locator(".portrait").evaluateAll((els) =>
    els.map((e) => {
      const r = e.getBoundingClientRect(),
        b = e.parentElement.getBoundingClientRect();
      return r.right <= b.right + 1 && r.bottom <= b.bottom + 1;
    }),
  );
  assert.ok(bounds.every(Boolean), "Portraits contained in desktop");
  await page.screenshot({
    path: "work/verified-home.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "Открыть: Мастер 01", exact: true })
    .click();
  await page.locator("#save-master").click();
  assert.match(await page.locator("#save-master").innerText(), /в избранном/);
  await page.goto(base + "/#/signup");
  await page.getByLabel("Как вас зовут").fill("Проверка браузера");
  await page
    .getByLabel("Почта для входа и чеков")
    .fill("e2e-" + Date.now() + "@example.invalid");
  await page
    .getByLabel("Пароль", { exact: true })
    .fill("Browser-testing-password-2026");
  await page.locator("input[name=rules]").check();
  await page.locator("input[name=consent]").check();
  await page.getByRole("button", { name: "Создать личное дело →" }).click();
  await page.locator("#logout").waitFor();
  await page.getByRole("link", { name: "Забронировать место ↗" }).click();
  const bookingDate = new Date(Date.now() + 3 * 86400000)
    .toISOString()
    .slice(0, 10);
  await page.locator('[data-day="' + bookingDate + '"]').click();
  await page.locator("#booking-next").click();
  await page.locator("[data-hour]:not([disabled])").first().click();
  await page.locator("[data-resource]:not([disabled])").first().click();
  await page.locator("#booking-next").click();
  await page.locator("#booking-next").click();
  await page.locator("#booking-agree").check();
  await page.locator("#booking-next").click();
  await page.locator("#test-pay").waitFor();
  await page.locator("#test-pay").click();
  await page.getByText("Подтверждено", { exact: true }).waitFor();
  await page.screenshot({
    path: "work/verified-cabinet.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.locator("[data-cancel]").click();
  await page.locator("#confirm-cancel").click();
  await page.getByText("В вашем календаре пока тихо.").waitFor();
  assert.ok((await page.locator(".stat").first().innerText()).includes("500"));
  await page.locator("#logout").click();
  await page
    .getByRole("link", { name: "Войти в офис →", exact: true })
    .waitFor();
  await page.goto(base + "/#/login");
  const env = Object.fromEntries(
    readFileSync("work/preview.env", "utf8")
      .trim()
      .split("\n")
      .map((x) => {
        const i = x.indexOf("=");
        return [x.slice(0, i), x.slice(i + 1)];
      }),
  );
  await page.getByLabel("Почта для входа и чеков").fill(env.ADMIN_EMAIL);
  await page.getByLabel("Пароль", { exact: true }).fill(env.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Войти →", exact: true }).click();
  await page.getByRole("link", { name: "Админка", exact: true }).click();
  await page.locator("#manual-booking").waitFor();
  await page.screenshot({
    path: "work/verified-admin.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Настройки", exact: true }).click();
  await page.getByLabel("Название", { exact: true }).fill("Tattoo Office");
  await page.getByRole("button", { name: "Сохранить настройки" }).click();
  await page.getByText("Настройки студии сохранены", { exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/?mobile=2#/masters");
  await page.locator(".portrait").first().waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "No horizontal overflow on mobile",
  );
  await page.screenshot({
    path: "work/verified-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("link", { name: "Забронировать место ↗" }).click();
  await page.locator(".calendar").waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Booking has no mobile overflow",
  );
  await page.screenshot({
    path: "work/verified-booking-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: desktop bounds, favorites, signup, booking, payment, cancellation balance, admin settings, mobile, zero page errors",
  );
} finally {
  await browser.close();
}

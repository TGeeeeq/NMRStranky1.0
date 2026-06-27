import { test, expect } from "@playwright/test";

const user = process.env.E2E_ADMIN_USER;
const pass = process.env.E2E_ADMIN_PASS;

test.describe("admin", () => {
  test.skip(!user || !pass, "E2E_ADMIN_USER / E2E_ADMIN_PASS not set");

  test("guard redirects, login works, dashboard renders", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.getByLabel("Uživatel").fill(user!);
    await page.getByLabel("Heslo").fill(pass!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Přehled" })).toBeVisible();
  });
});

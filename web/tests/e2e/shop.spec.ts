import { test, expect } from "@playwright/test";

test("browse → add to cart → checkout → confirmation", async ({ page }) => {
  await page.goto("/obchod");
  await expect(page.getByRole("heading", { name: "Luční obchůdek" })).toBeVisible();

  // open the first product
  const firstProduct = page.locator("article a").first();
  await firstProduct.click();
  await expect(page.getByRole("button", { name: /Do košíku|Vyprodáno/ })).toBeVisible();

  const addBtn = page.getByRole("button", { name: "Do košíku" });
  if (!(await addBtn.isVisible())) test.skip(true, "first product sold out");
  await addBtn.click();

  await page.goto("/obchod/kosik");
  await page.getByRole("link", { name: "K pokladně" }).click();

  await page.getByLabel("Jméno a příjmení *").fill("E2E Test");
  await page.getByLabel("E-mail *").fill("e2e@example.cz");
  await page.getByLabel("Ulice a č.p. *").fill("Testovací 1");
  await page.getByLabel("Město *").fill("Praha");
  await page.getByLabel("PSČ *").fill("11000");
  await page.getByRole("button", { name: "Odeslat objednávku" }).click();

  await expect(page).toHaveURL(/\/obchod\/objednavka\//);
  await expect(page.getByText("Variabilní symbol")).toBeVisible();
});

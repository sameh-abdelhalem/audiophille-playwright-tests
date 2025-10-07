import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/pageManager";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().goto();
  });
  test("✅ Homepage: logo is visible @smoke @ui", async ({ page }) => {
    const pm = new PageManager(page);
    await expect(pm.onHomePage().logo).toBeVisible();
  });
  test("✅ Homepage: primary navigation links render correctly @regression @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await expect(pm.onHomePage().headphonesLink).toBeVisible();
    await expect(pm.onHomePage().headphonesLink).toBeEnabled();
    await expect(pm.onHomePage().headphonesLink).toHaveText("HEADPHONES");
    await expect(pm.onHomePage().speakersLink).toBeVisible();
    await expect(pm.onHomePage().speakersLink).toBeEnabled();
    await expect(pm.onHomePage().speakersLink).toHaveText("SPEAKERS");
    await expect(pm.onHomePage().earphonesLink).toBeVisible();
    await expect(pm.onHomePage().earphonesLink).toBeEnabled();
    await expect(pm.onHomePage().earphonesLink).toHaveText("EARPHONES");
  });
  test("✅ Homepage: hero section and CTA visible @smoke @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await expect(pm.onHomePage().heroSection).toBeVisible();
    await expect(pm.onHomePage().seeProductButton).toBeVisible();
    await expect(pm.onHomePage().seeProductButton).toBeEnabled();
  });

  test("✅ Homepage: category cards navigate correctly @regression @navigation @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await expect(pm.onHomePage().categoryCards.nth(0)).toBeVisible();
    await expect(pm.onHomePage().categoryCards.nth(1)).toBeVisible();
    await expect(pm.onHomePage().categoryCards.nth(2)).toBeVisible();
    await pm.onHomePage().categoryCards.nth(0).click();
    await expect(page).toHaveURL(/.*headphones.*/);
    await page.goBack();
    await pm.onHomePage().categoryCards.nth(1).click();
    await expect(page).toHaveURL(/.*speakers.*/);
    await page.goBack();
    await pm.onHomePage().categoryCards.nth(2).click();
    await expect(page).toHaveURL(/.*earphones.*/);
  });

  test("✅ Homepage: cart icon and footer visible @smoke @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    const homePage = pm.onHomePage();
    await expect(homePage.cartIcon).toBeVisible();
    await expect(homePage.cartIcon).toBeEnabled();
    await expect(homePage.footer).toBeVisible();
  });
});

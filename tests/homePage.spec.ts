import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForReadyState("domcontentloaded");
  });
  test("✅ Homepage: logo is visible @smoke @ui", async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(homePage.logo).toBeVisible();
  });
  test("✅ Homepage: primary navigation links render correctly @regression @ui", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await expect(homePage.headphonesLink).toBeVisible();
    await expect(homePage.headphonesLink).toBeEnabled();
    await expect(homePage.headphonesLink).toHaveText("HEADPHONES");
    await expect(homePage.speakersLink).toBeVisible();
    await expect(homePage.speakersLink).toBeEnabled();
    await expect(homePage.speakersLink).toHaveText("SPEAKERS");
    await expect(homePage.earphonesLink).toBeVisible();
    await expect(homePage.earphonesLink).toBeEnabled();
    await expect(homePage.earphonesLink).toHaveText("EARPHONES");
  });
  test("✅ Homepage: hero section and CTA visible @smoke @ui", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.seeProductButton).toBeVisible();
    await expect(homePage.seeProductButton).toBeEnabled();
  });

  test("✅ Homepage: category cards navigate correctly @regression @navigation @ui", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await expect(homePage.categoryCards.nth(0)).toBeVisible();
    await expect(homePage.categoryCards.nth(1)).toBeVisible();
    await expect(homePage.categoryCards.nth(2)).toBeVisible();
    await homePage.categoryCards.nth(0).click();
    await expect(page).toHaveURL(/.*headphones.*/);
    await page.goBack();
    await homePage.categoryCards.nth(1).click();
    await expect(page).toHaveURL(/.*speakers.*/);
    await page.goBack();
    await homePage.categoryCards.nth(2).click();
    await expect(page).toHaveURL(/.*earphones.*/);
  });

  test("✅ Homepage: cart icon and footer visible @smoke @ui", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await expect(homePage.cartIcon).toBeVisible();
    await expect(homePage.cartIcon).toBeEnabled();
    await expect(homePage.footer).toBeVisible();
  });
});

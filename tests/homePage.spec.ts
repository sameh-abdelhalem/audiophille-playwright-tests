import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });
  test("Verify logo visibility", async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(homePage.logo).toBeVisible();
  });
  test("Verify Navigation Links", async ({ page }) => {
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
  test("Verify hero section and See Product button", async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.seeProductButton).toBeVisible();
    await expect(homePage.seeProductButton).toBeEnabled();
  });

  test("Verify category cards are visible and clickable", async ({ page }) => {
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

  test("Verify cart icon and footer visibility", async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(homePage.cartIcon).toBeVisible();
    await expect(homePage.cartIcon).toBeEnabled();
    await expect(homePage.footer).toBeVisible();
  });
});

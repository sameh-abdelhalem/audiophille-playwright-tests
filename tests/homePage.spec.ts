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
});

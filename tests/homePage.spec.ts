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
});

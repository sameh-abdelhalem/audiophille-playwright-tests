import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";

test.describe("Audiophille E-Commerce - Navigation", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should navigate to Headphones category", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    await homePage.headphonesLink.click();
    await expect(categoryPage.categoryTitle).toContainText("headphones");
  });

  test("should navigate to Speakers category", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    await homePage.speakersLink.click();
    await expect(categoryPage.categoryTitle).toContainText("speakers");
  });

  test("should navigate to Earphones category", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    await homePage.earphonesLink.click();
    await expect(categoryPage.categoryTitle).toContainText("earphones");
  });
});

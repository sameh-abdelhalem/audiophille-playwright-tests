import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";
import { productNames } from "../fixtures/productNames";

test.describe("Audiophille E-Commerce - Navigation", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test("✅ should navigate to Headphones category @smoke @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    await homePage.navigateToCategory("headphones");
    await expect(categoryPage.categoryTitle).toContainText("headphones");
    await expect(categoryPage.categoryTitle).toBeVisible();
    await expect(categoryPage.firstProduct).toBeVisible();
    await expect(
      categoryPage.firstProduct.getByRole("button", { name: /See Product/i })
    ).toBeVisible();
    await expect(categoryPage.firstProductTitle).toHaveText(
      productNames.headphones
    );
  });

  test("✅ should navigate to Speakers category @smoke @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    await homePage.navigateToCategory("speakers");
    await expect(categoryPage.categoryTitle).toContainText("speakers");
    await expect(categoryPage.categoryTitle).toBeVisible();
    await expect(categoryPage.firstProduct).toBeVisible();
    await expect(
      categoryPage.firstProduct.getByRole("button", { name: /See Product/i })
    ).toBeVisible();
    await expect(categoryPage.firstProductTitle).toHaveText(
      productNames.speakers
    );
  });

  test("✅ should navigate to Earphones category @smoke @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    await homePage.navigateToCategory("earphones");
    await expect(categoryPage.categoryTitle).toContainText("earphones");
    await expect(categoryPage.categoryTitle).toBeVisible();
    await expect(categoryPage.firstProduct).toBeVisible();
    await expect(
      categoryPage.firstProduct.getByRole("button", { name: /see product/i })
    ).toBeVisible();
    await expect(categoryPage.firstProductTitle).toHaveText(
      productNames.earphones
    );
  });
  test("✅ should navigate to Home page when Home link is clicked @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.navigateToCategory("headphones");
    await expect(page).toHaveURL(/.*headphones.*/);
    await homePage.homeLink.click();
    await expect(page).toHaveURL("/audiophille-ecommerce");
    await expect(homePage.heroSection).toBeVisible();
  });
  test("✅ should navigate to Home page when logo is clicked @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.navigateToCategory("speakers");
    await expect(page).toHaveURL(/.*speakers.*/);
    await homePage.logo.click();
    await expect(page).toHaveURL("/audiophille-ecommerce");
    await expect(homePage.heroSection).toBeVisible();
  });
});

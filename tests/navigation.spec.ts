import { test, expect } from "@playwright/test";
import { productNames } from "../fixtures/productNames";
import { PageManager } from "../pages/pageManager";

test.describe("Audiophille E-Commerce - Navigation", () => {
  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().goto();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
  });

  test("✅ should navigate to Headphones category @smoke @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("headphones");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await expect(pm.onCategoryPage().categoryTitle).toContainText("headphones");
    await expect(pm.onCategoryPage().categoryTitle).toBeVisible();
    await expect(pm.onCategoryPage().firstProduct).toBeVisible();
    await expect(
      pm
        .onCategoryPage()
        .firstProduct.getByRole("button", { name: /See Product/i })
    ).toBeVisible();
    await expect(pm.onCategoryPage().firstProductTitle).toHaveText(
      productNames.headphones
    );
  });

  test("✅ should navigate to Speakers category @smoke @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("speakers");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await expect(pm.onCategoryPage().categoryTitle).toContainText("speakers");
    await expect(pm.onCategoryPage().categoryTitle).toBeVisible();
    await expect(pm.onCategoryPage().firstProduct).toBeVisible();
    await expect(
      pm
        .onCategoryPage()
        .firstProduct.getByRole("button", { name: /See Product/i })
    ).toBeVisible();
    await expect(pm.onCategoryPage().firstProductTitle).toHaveText(
      productNames.speakers
    );
  });

  test("✅ should navigate to Earphones category @smoke @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("earphones");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await expect(pm.onCategoryPage().categoryTitle).toContainText("earphones");
    await expect(pm.onCategoryPage().categoryTitle).toBeVisible();
    await expect(pm.onCategoryPage().firstProduct).toBeVisible();
    await expect(
      pm
        .onCategoryPage()
        .firstProduct.getByRole("button", { name: /see product/i })
    ).toBeVisible();
    await expect(pm.onCategoryPage().firstProductTitle).toHaveText(
      productNames.earphones
    );
  });
  test("✅ should navigate to Home page when Home link is clicked @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("headphones");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await expect(page).toHaveURL(/.*headphones.*/);
    await pm.onHomePage().homeLink.click();
    await expect(page).toHaveURL("/audiophille-ecommerce");
    await expect(pm.onHomePage().heroSection).toBeVisible();
  });
  test("✅ should navigate to Home page when logo is clicked @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("speakers");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await expect(page).toHaveURL(/.*speakers.*/);
    await pm.onHomePage().logo.click();
    await expect(page).toHaveURL("/audiophille-ecommerce");
    await expect(pm.onHomePage().heroSection).toBeVisible();
  });
});

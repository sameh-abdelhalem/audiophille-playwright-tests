import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { products } from "../fixtures/products";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductPage } from "../pages/ProductPage";

test.describe("Audiophille E-Commerce - Product", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should open ZX7 Speaker product page", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    // Navigate to Speakers category
    await homePage.speakersLink.click();

    // Click on First Product ZX7 Speaker
    await categoryPage.firstProductButton.click();

    // Verify product details
    await expect(productPage.productTitle).toBeVisible();
    await expect(productPage.productTitle).toHaveText(
      products.ZX7Speaker.header
    );
    await expect(productPage.productDescription).toBeVisible();
    await expect(productPage.productDescription).toHaveText(
      products.ZX7Speaker.description
    );

    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.productPrice).toHaveText(
      products.ZX7Speaker.price
    );
    // Check image by src URL
    await expect(
      page.locator(`img[src="${products.ZX7Speaker.imageURL}"]`).first()
    ).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test("should open  XX59 Headphones page", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    // Navigate to Headphones category
    await homePage.headphonesLink.click();

    // Click on  XX59 Headphones page
    await categoryPage.firstProductButton.click();

    // Verify product details
    await expect(productPage.productTitle).toBeVisible();
    await expect(productPage.productTitle).toHaveText(
      products.XX59Headphones.header
    );
    await expect(productPage.productDescription).toBeVisible();
    await expect(productPage.productDescription).toHaveText(
      products.XX59Headphones.description
    );

    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.productPrice).toHaveText(
      products.XX59Headphones.price
    );
    // Check image by src URL
    await expect(
      page.locator(`img[src="${products.XX59Headphones.imageURL}"]`).first()
    ).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test("should not show missing product details (negative test)", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    // Navigate to Speakers category
    await homePage.speakersLink.click();

    // Click on ZX7 Speaker
    await categoryPage.firstProductButton.click();

    // Negative assertions (should not be empty/missing)
    await expect(productPage.productTitle).not.toHaveText("");
    await expect(productPage.productDescription).not.toHaveText("");
    await expect(productPage.productPrice).not.toHaveText("");
    await expect(productPage.addToCartButton).toBeEnabled();
  });
});

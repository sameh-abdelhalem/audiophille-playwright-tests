import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/pageManager";
import { products } from "../fixtures/products";

test.describe("Audiophille E-Commerce - Product", () => {
  test.beforeEach(async ({ page }) => {
    await new PageManager(page).onHomePage().goto();
  });

  test("✅ Product: ZX7 Speaker details display correctly @smoke @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().speakersLink.click();
    await pm.onCategoryPage().openFirstProduct();
    const prod = pm.onProductPage();
    await expect(prod.productTitle).toBeVisible();
    await expect(prod.productTitle).toHaveText(products.ZX7Speaker.header);
    await expect(prod.productDescription).toBeVisible();
    await expect(prod.productDescription).toHaveText(
      products.ZX7Speaker.description
    );
    await expect(prod.productPrice).toBeVisible();
    await expect(prod.productPrice).toHaveText(products.ZX7Speaker.price);
    await expect(
      page.locator(`img[src="${products.ZX7Speaker.imageURL}"]`).first()
    ).toBeVisible();
    await expect(prod.addToCartButton).toBeVisible();
  });

  test("✅ Product: XX59 Headphones details display correctly @regression @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    // Navigate to Headphones category
    await pm.onHomePage().headphonesLink.click();

    // Click on  XX59 Headphones page
    await pm.onCategoryPage().firstProductButton.click();

    // Verify product details
    await expect(pm.onProductPage().productTitle).toBeVisible();
    await expect(pm.onProductPage().productTitle).toHaveText(
      products.XX59Headphones.header
    );
    await expect(pm.onProductPage().productDescription).toBeVisible();
    await expect(pm.onProductPage().productDescription).toHaveText(
      products.XX59Headphones.description
    );

    await expect(pm.onProductPage().productPrice).toBeVisible();
    await expect(pm.onProductPage().productPrice).toHaveText(
      products.XX59Headphones.price
    );
    // Check image by src URL
    await expect(
      page.locator(`img[src="${products.XX59Headphones.imageURL}"]`).first()
    ).toBeVisible();
    await expect(pm.onProductPage().addToCartButton).toBeVisible();
  });

  test("❌ Product: no missing required details (negative validation) @negative @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    // Navigate to Speakers category
    await pm.onHomePage().speakersLink.click();

    // Click on ZX7 Speaker
    await pm.onCategoryPage().firstProductButton.click();

    // Negative assertions (should not be empty/missing)
    await expect(pm.onProductPage().productTitle).not.toHaveText("");
    await expect(pm.onProductPage().productDescription).not.toHaveText("");
    await expect(pm.onProductPage().productPrice).not.toHaveText("");
    await expect(pm.onProductPage().addToCartButton).toBeEnabled();
  });
});

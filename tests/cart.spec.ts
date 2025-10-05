import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductPage } from "../pages/ProductPage";

test.describe("Cart Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });
  test("✅ Cart loads empty state correctly @smoke @negative", async ({
    page,
  }) => {
    const cartPage = new CartPage(page);
    const homePage = new HomePage(page);
    await homePage.cartIcon.click(); // Navigate to cart page
    await cartPage.assertEmptyCart();
  });

  test("✅ Add product to cart enables checkout @positive @regression", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await homePage.headphonesLink.click();
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click(); // navigate to cart page
    await cartPage.assertCartNotEmpty();
  });

  test("✅ Add multiple items, total and count update correctly @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add first item
    await homePage.headphonesLink.click();
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();

    // Add second item (navigate to speakers)
    await homePage.speakersLink.click();
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();

    await homePage.cartIcon.click();
    const itemCount = await cartPage.getItemCount();
    await expect(itemCount).toBe(2);
    await expect(cartPage.checkoutButton).toBeEnabled();
  });

  test("✅ Remove item updates cart count @positive", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add item
    await homePage.headphonesLink.click();
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();

    // Remove all items
    await cartPage.removeAllItems();
    await cartPage.assertEmptyCart();
  });

  test("✅ Cart persists during navigation @positive", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add item
    await homePage.headphonesLink.click();
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();

    // Navigate away

    await homePage.speakersLink.click();

    // Return to cart
    await homePage.cartIcon.click();
    await cartPage.assertCartNotEmpty();
  });

  test("❌ Checkout button disabled with empty cart @negative", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    await homePage.cartIcon.click();
    await expect(cartPage.checkoutButton).toBeDisabled();
    await cartPage.assertEmptyCart();
  });

  test("❌ Add-to-cart twice doesn’t duplicate incorrectly @negative", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.headphonesLink.click();
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await productPage.addToCartButton.click(); // Add same item again

    await homePage.cartIcon.click();
    const itemCount = await cartPage.getItemCount();
    // Should only be one cart item, but quantity may increase
    await expect(itemCount).toBe(1);
    // Optionally check quantity if available:
    await expect(cartPage.singleItemQuantity).toHaveText("2");
  });

  test("❌ Remove from empty cart shows 0 @negative", async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.cartIcon.click();
    await cartPage.removeAllItems();
    // Assert empty cart message is visible
    await cartPage.assertEmptyCart();
  });
});

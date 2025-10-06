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

  test("✅ Add product to cart enables checkout @smoke @positive @regression", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click(); // navigate to cart
    await cartPage.waitForReady();
    await expect(cartPage.checkoutButton).toBeEnabled();
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
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    // Wait for cart to update
    await expect(homePage.cartIcon).toBeVisible();

    // Add second item (navigate to speakers)
    await homePage.speakersLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();

    await homePage.cartIcon.click();
    await cartPage.waitForReady();
    // Wait for both items to appear
    await expect(cartPage.cartItems.nth(1)).toBeVisible();
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
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.waitForReady();
    await expect(cartPage.checkoutButton).toBeEnabled();

    // Remove all items
    await cartPage.removeAllItems();
    // Wait for cart to be empty
    await expect(cartPage.checkoutButton).toBeDisabled();
    await cartPage.assertEmptyCart();
  });

  test("✅ Cart persists during navigation @positive", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add item
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();

    // Navigate away
    await homePage.speakersLink.click();
    await categoryPage.waitForFirstProduct();
    await expect(categoryPage.categoryTitle).toContainText("speakers");

    // Return to cart
    await homePage.cartIcon.click();
    await cartPage.waitForReady();
    await expect(cartPage.checkoutButton).toBeEnabled();
    await cartPage.assertCartNotEmpty();
  });

  test("❌ Checkout button disabled with empty cart @negative", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    await homePage.cartIcon.click();
    await cartPage.waitForReady();
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
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await productPage.addToCartButton.click(); // Add same item again

    await homePage.cartIcon.click();
    await cartPage.waitForReady();
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
    await cartPage.waitForReady();
    await cartPage.removeAllItems();
    // Assert empty cart message is visible
    await cartPage.assertEmptyCart();
  });

  test("✅ Quantity controls (+/-) update product quantity @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add item
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.waitForReady();

    // Initial quantity should be 1
    let quantity = await cartPage.getSingleItemQuantity();
    await expect(quantity).toBe(1);

    // Click plus, quantity should be 2
    await cartPage.plusButton.click();
    quantity = await cartPage.getSingleItemQuantity();
    await expect(quantity).toBe(2);
    await expect(cartPage.singleItemQuantity).toHaveText("2");

    // Click minus, quantity should be 1
    await cartPage.minusButton.click();
    quantity = await cartPage.getSingleItemQuantity();
    await expect(quantity).toBe(1);

    // Click minus again, quantity product should be deleated from cart
    await cartPage.minusButton.click();
    await cartPage.assertEmptyCart();
  });

  test("✅ Quantity controls work for multiple products @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add first product
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();

    // Add second product
    await homePage.speakersLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();

    await homePage.cartIcon.click();
    await cartPage.waitForReady();
    await expect(cartPage.cartItems.nth(1)).toBeVisible();

    // Increase quantity for first product
    await cartPage.getPlusButton(0).click();
    await expect(cartPage.getProductQuantity(0)).toHaveText("2");
    let quantity1 = await cartPage.getQuantityValue(0);
    await expect(quantity1).toBe(2);

    // Increase quantity for second product
    await cartPage.getPlusButton(1).click();
    await expect(cartPage.getProductQuantity(1)).toHaveText("2");
    let quantity2 = await cartPage.getQuantityValue(1);
    await expect(quantity2).toBe(2);

    // Decrease quantity for second product
    await cartPage.getMinusButton(1).click();
    await expect(cartPage.getProductQuantity(1)).toHaveText("1");
    quantity2 = await cartPage.getQuantityValue(1);
    await expect(quantity2).toBe(1);

    // Try to decrease below 1 for second product (should remove it)
    await cartPage.getMinusButton(1).click();
    await expect(cartPage.cartItems.nth(1)).not.toBeVisible();
    const itemCount = await cartPage.getItemCount();
    await expect(itemCount).toBe(1);
  });

  test("✅ Remove single product when multiple in cart @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add two products
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await homePage.speakersLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();

    await homePage.cartIcon.click();
    await cartPage.waitForReady();

    // Remove first product by decreasing quantity to zero
    await cartPage.getMinusButton(0).click();

    // Only one product should remain
    const itemCount = await cartPage.getItemCount();
    await expect(itemCount).toBe(1);
  });

  test("✅ Total price updates with quantity changes @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add product
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.waitForReady();

    // Get initial total price
    const initialPriceText = await cartPage.totalPrice.textContent();
    const initialPrice = parseInt(
      initialPriceText?.replace(/\D/g, "") || "0",
      10
    );
    console.log("Initial Price:", initialPrice);
    // Increase quantity
    await cartPage.plusButton.click();
    const updatedPriceText = await cartPage.totalPrice.textContent();
    const updatedPrice = parseInt(
      updatedPriceText?.replace(/\D/g, "") || "0",
      10
    );
    console.log("Updated Price:", updatedPrice);

    await expect(updatedPrice).toBeGreaterThan(initialPrice);
  });

  test("✅ Add multiple quantities of products at once from product page @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add 2 headphones at once
    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();
    await productPage.plusButton.click();
    await expect(await productPage.getQuantityValue()).toBe(2);
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();

    // Add 3 speakers at once
    await homePage.speakersLink.click();
    await categoryPage.openFirstProduct();
    await productPage.plusButton.click();
    await productPage.plusButton.click();
    await expect(await productPage.getQuantityValue()).toBe(3);
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();

    await homePage.cartIcon.click();
    await cartPage.waitForReady();

    // Cart should have 2 items, with correct quantities
    const itemCount = await cartPage.getItemCount();
    await expect(itemCount).toBe(2);
    await expect(await cartPage.getQuantityValue(0)).toBe(2);
    await expect(await cartPage.getQuantityValue(1)).toBe(3);
  });

  test("❌ Minus button on product page does not decrease quantity below 1 @negative", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);

    await homePage.headphonesLink.click();
    await categoryPage.openFirstProduct();

    // Initial quantity should be 1
    let quantity = await productPage.getQuantityValue();
    await expect(quantity).toBe(1);

    // Click minus, quantity should remain 1
    await productPage.minusButton.click();
    quantity = await productPage.getQuantityValue();
    await expect(quantity).toBe(1);
  });
});

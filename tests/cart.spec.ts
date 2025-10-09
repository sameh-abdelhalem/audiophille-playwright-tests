import { test, expect } from "@playwright/test";
import { PageManager } from "../pages/pageManager";

test.describe("Cart Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().goto();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
  });
  test("✅ Cart loads empty state correctly @smoke @negative", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().cartIcon.click(); // Navigate to cart page
    await pm.onCartPage().assertEmptyCart();
  });

  test("✅ Add product to cart enables checkout @smoke @positive @regression", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().headphonesLink.click();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();

    // wait for item count to update
    await expect(pm.onHomePage().cartItemCount).toContainText("1");

    await pm.onHomePage().cartIcon.click(); // navigate to cart
    await pm.onCartPage().waitForReady();
    await expect(pm.onCartPage().checkoutButton).toBeEnabled();
    await pm.onCartPage().assertCartNotEmpty();
  });

  test("✅ Add multiple items, total and count update correctly @positive", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add first item
    await pm.onHomePage().headphonesLink.click();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    // Wait for cart to update
    await expect(pm.onHomePage().cartIcon).toBeVisible();

    // Add second item (navigate to speakers)
    await pm.onHomePage().speakersLink.click();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartIcon).toBeVisible();

    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    // Wait for both items to appear
    await expect(pm.onCartPage().cartItems.nth(1)).toBeVisible();
    const itemCount = await pm.onCartPage().getItemCount();
    await expect(itemCount).toBe(2);
    await expect(pm.onCartPage().checkoutButton).toBeEnabled();
  });

  test("✅ Remove item updates cart count @positive", async ({ page }) => {
    const pm = new PageManager(page);

    // Add item
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();

    await expect(pm.onHomePage().cartItemCount).toContainText("1");
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    await expect(pm.onCartPage().checkoutButton).toBeEnabled();

    // Remove all items
    await pm.onCartPage().removeAllItems();
    // Wait for cart to be empty
    await expect(pm.onCartPage().checkoutButton).toBeDisabled();
    await pm.onCartPage().assertEmptyCart();
  });

  test("✅ Cart persists during navigation @positive", async ({ page }) => {
    const pm = new PageManager(page);

    // Add item
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toContainText("1");

    // Navigate away
    await pm.onHomePage().speakersLink.click();
    await pm.onCategoryPage().waitForFirstProduct();
    await expect(pm.onCategoryPage().categoryTitle).toContainText("speakers");

    // Return to cart
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    await expect(pm.onCartPage().checkoutButton).toBeEnabled();
    await pm.onCartPage().assertCartNotEmpty();
  });

  test("❌ Checkout button disabled with empty cart @negative", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    await expect(pm.onCartPage().checkoutButton).toBeDisabled();
    await pm.onCartPage().assertEmptyCart();
  });

  test("❌ Add-to-cart twice doesn’t duplicate incorrectly @negative", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await pm.onProductPage().addToCartButton.click(); // Add same item again

    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    const itemCount = await pm.onCartPage().getItemCount();
    // Should only be one cart item, but quantity may increase
    await expect(itemCount).toBe(1);
    // Optionally check quantity if available:
    await expect(pm.onCartPage().singleItemQuantity).toHaveText("2");
  });

  test("❌ Remove from empty cart shows 0 @negative", async ({ page }) => {
    const pm = new PageManager(page);

    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    await pm.onCartPage().removeAllItems();
    // Assert empty cart message is visible
    await pm.onCartPage().assertEmptyCart();
  });

  test("✅ Quantity controls (+/-) update product quantity @positive", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add item
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toContainText("1");
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();

    // Initial quantity should be 1
    let quantity = await pm.onCartPage().getSingleItemQuantity();
    await expect(quantity).toBe(1);

    // Click plus, quantity should be 2
    await pm.onCartPage().plusButton.click();
    quantity = await pm.onCartPage().getSingleItemQuantity();
    await expect(quantity).toBe(2);
    await expect(pm.onCartPage().singleItemQuantity).toHaveText("2");

    // Click minus, quantity should be 1
    await pm.onCartPage().minusButton.click();
    quantity = await pm.onCartPage().getSingleItemQuantity();
    await expect(quantity).toBe(1);

    // Click minus again, quantity product should be deleated from cart
    await pm.onCartPage().minusButton.click();
    await pm.onCartPage().assertEmptyCart();
  });

  test("✅ Quantity controls work for multiple products @positive", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add first product
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartIcon).toBeVisible();

    // Add second product
    await pm.onHomePage().speakersLink.click();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartIcon).toBeVisible();

    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    await expect(pm.onCartPage().cartItems.nth(1)).toBeVisible();

    // Increase quantity for first product
    await pm.onCartPage().getPlusButton(0).click();
    await expect(pm.onCartPage().getProductQuantity(0)).toHaveText("2");
    let quantity1 = await pm.onCartPage().getQuantityValue(0);
    await expect(quantity1).toBe(2);

    // Increase quantity for second product
    await pm.onCartPage().getPlusButton(1).click();
    await expect(pm.onCartPage().getProductQuantity(1)).toHaveText("2");
    let quantity2 = await pm.onCartPage().getQuantityValue(1);
    await expect(quantity2).toBe(2);

    // Decrease quantity for second product
    await pm.onCartPage().getMinusButton(1).click();
    await expect(pm.onCartPage().getProductQuantity(1)).toHaveText("1");
    quantity2 = await pm.onCartPage().getQuantityValue(1);
    await expect(quantity2).toBe(1);

    // Try to decrease below 1 for second product (should remove it)
    await pm.onCartPage().getMinusButton(1).click();
    await expect(pm.onCartPage().cartItems.nth(1)).not.toBeVisible();
    const itemCount = await pm.onCartPage().getItemCount();
    await expect(itemCount).toBe(1);
  });

  test("✅ Remove single product when multiple in cart @positive", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add two products
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();

    await expect(pm.onHomePage().cartItemCount).toContainText("1");
    await pm.onHomePage().speakersLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toContainText("2");

    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();

    // Remove first product by decreasing quantity to zero
    await pm.onCartPage().getMinusButton(0).click();

    // Only one product should remain
    const itemCount = await pm.onCartPage().getItemCount();
    await expect(itemCount).toBe(1);
  });

  test("✅ Total price updates with quantity changes @positive", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add product
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();

    // Get initial total price
    const initialPriceText = await pm.onCartPage().totalPrice.textContent();
    const initialPrice = parseInt(
      initialPriceText?.replace(/\D/g, "") || "0",
      10
    );
    // Increase quantity
    await pm.onCartPage().plusButton.click();
    const updatedPriceText = await pm.onCartPage().totalPrice.textContent();
    const updatedPrice = parseInt(
      updatedPriceText?.replace(/\D/g, "") || "0",
      10
    );

    await expect(updatedPrice).toBeGreaterThan(initialPrice);
  });

  test("✅ Add multiple quantities of products at once from product page @positive", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add 2 headphones at once
    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().plusButton.click();
    await expect(await pm.onProductPage().getQuantityValue()).toBe(2);
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toContainText("2");

    // Add 3 speakers at once
    await pm.onHomePage().speakersLink.click();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().plusButton.click();
    await expect(await pm.onProductPage().getQuantityValue()).toBe(2);

    await pm.onProductPage().plusButton.click();
    await expect(await pm.onProductPage().getQuantityValue()).toBe(3);
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toContainText("5");
    await expect(pm.onHomePage().cartIcon).toBeVisible();

    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();

    // Cart should have 2 items, with correct quantities
    const itemCount = await pm.onCartPage().getItemCount();
    await expect(itemCount).toBe(2);
    await expect(await pm.onCartPage().getQuantityValue(0)).toBe(2);
    await expect(await pm.onCartPage().getQuantityValue(1)).toBe(3);
  });

  test("❌ Minus button on product page does not decrease quantity below 1 @negative", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    await pm.onHomePage().headphonesLink.click();
    await pm.onCategoryPage().openFirstProduct();

    // Initial quantity should be 1
    let quantity = await pm.onProductPage().getQuantityValue();
    await expect(quantity).toBe(1);

    // Click minus, quantity should remain 1
    await pm.onProductPage().minusButton.click();
    quantity = await pm.onProductPage().getQuantityValue();
    await expect(quantity).toBe(1);
  });
});

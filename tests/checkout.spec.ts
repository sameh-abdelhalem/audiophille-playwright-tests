import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { testData } from "../fixtures/testData";

test.describe("Checkout Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test("✅ Loads checkout page from cart @smoke", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add product and go to checkout
    await homePage.navigateToCategory("headphones");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.checkoutTitle).toBeVisible();
  });

  test("✅ Fill billing details and submit @positive", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigateToCategory("speakers");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillBillingDetails(testData.billing.john);
    await checkoutPage.selectPaymentMethod("Cash on Delivery");
    await checkoutPage.submitOrder();

    // Assert summary or confirmation appears
    await expect(checkoutPage.summarySection).toBeVisible();
  });

  test("❌ Required fields validation @negative", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigateToCategory("earphones");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    // Leave fields empty and submit
    await checkoutPage.submitOrder();

    // Assert error messages are visible
    await expect(checkoutPage.errorMessages.first()).toBeVisible();
  });

  test("✅ Select payment method @positive", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigateToCategory("headphones");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.selectPaymentMethod("Cash on Delivery");
    await expect(page.getByLabel("Cash on Delivery")).toBeChecked();
  });

  test("✅ Fill e-Money payment details and submit @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigateToCategory("speakers");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.selectPaymentMethod("e-Money");
    await checkoutPage.fillBillingDetails(testData.billing.jane);
    await checkoutPage.submitOrder();
    await expect(checkoutPage.summarySection).toBeVisible();
  });

  test("❌ e-Money payment fields required @negative", async ({ page }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigateToCategory("speakers");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.selectPaymentMethod("e-Money");
    await checkoutPage.fillBillingDetails(
      // eMoneyNumber and eMoneyPin intentionally omitted
      testData.billing.janeWithoutEMoney
    );
    await checkoutPage.submitOrder();
    await expect(
      checkoutPage.errorMessages.getByText("please type your enum")
    ).toBeVisible();
  });

  test("✅ Checkout confirmation popup appears and is correct @positive", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.navigateToCategory("speakers");
    await categoryPage.firstProductButton.click();
    await productPage.addToCartButton.click();
    await homePage.cartIcon.click();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillBillingDetails(testData.billing.john);
    await checkoutPage.selectPaymentMethod("Cash on Delivery");
    await checkoutPage.submitOrder();

    // Validate confirmation popup
    await expect(checkoutPage.confirmationPopup).toBeVisible();
    await expect(checkoutPage.confirmationTitle).toBeVisible();
    await expect(checkoutPage.confirmationOrderSummary).toBeVisible();
    await expect(checkoutPage.confirmationGrandTotal).toBeVisible();
    await expect(checkoutPage.confirmationBackHomeButton).toBeVisible();
    await expect(checkoutPage.confirmationBackHomeButton).toBeEnabled();
    await checkoutPage.confirmationBackHomeButton.click();
    await expect(page).toHaveURL("/audiophille-ecommerce");
  });
});

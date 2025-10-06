import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { testData } from "../fixtures/testData";
import { PaymentMethod } from "../fixtures/paymentMethod";

test.describe("Checkout Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });

  test("✅ Loads checkout page from cart @smoke @positive @ui", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Add product and go to checkout
    await homePage.navigateToCategory("headphones");
    await categoryPage.firstProductButton.click();
    await expect(productPage.addToCartButton).toBeVisible();
    await productPage.addToCartButton.click();
    await expect(homePage.cartIcon).toBeVisible();
    await homePage.cartIcon.click();
    await expect(cartPage.checkoutButton).toBeVisible();
    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout.*/);
    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.checkoutTitle).toBeVisible();
  });

  test("✅ Fill billing details and submit order @positive @regression @ui", async ({
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

    // Wait for checkout button to be enabled before clicking
    await expect(cartPage.checkoutButton).toBeEnabled();
    await cartPage.checkoutButton.click();

    const checkoutPage = new CheckoutPage(page);
    await expect(checkoutPage.checkoutTitle).toBeVisible();
    await checkoutPage.fillBillingDetails(testData.billing.john);
    await checkoutPage.selectPaymentMethod(PaymentMethod.CashOnDelivery);
    await checkoutPage.submitOrder();

    // Assert summary or confirmation appears
    await expect(checkoutPage.summarySection).toBeVisible();
  });

  test("❌ Required fields validation shows error @negative @ui", async ({
    page,
  }) => {
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

  test("✅ Select payment method Cash on Delivery @positive @ui", async ({
    page,
  }) => {
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
    await checkoutPage.selectPaymentMethod(PaymentMethod.CashOnDelivery);
    await expect(page.getByLabel("Cash on Delivery")).toBeChecked();
  });

  test("✅ Fill e-Money payment details and submit order @positive @regression @ui", async ({
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
    await checkoutPage.selectPaymentMethod(PaymentMethod.EMoney);
    await checkoutPage.fillBillingDetails(testData.billing.jane);
    await checkoutPage.submitOrder();
    await expect(checkoutPage.summarySection).toBeVisible();
  });

  test("❌ e-Money payment fields required validation @negative @ui", async ({
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
    await checkoutPage.selectPaymentMethod(PaymentMethod.EMoney);
    await checkoutPage.fillBillingDetails(
      // eMoneyNumber and eMoneyPin intentionally omitted
      testData.billing.janeWithoutEMoney
    );
    await checkoutPage.submitOrder();
    await expect(
      checkoutPage.errorMessages.getByText("please type your enum")
    ).toBeVisible();
  });

  test("✅ Checkout confirmation popup appears and is correct @positive @regression @ui", async ({
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
    await checkoutPage.selectPaymentMethod(PaymentMethod.CashOnDelivery);
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

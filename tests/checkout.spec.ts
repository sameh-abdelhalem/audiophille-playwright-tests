import { test, expect } from "@playwright/test";
import { testData } from "../fixtures/testData";
import { PaymentMethod } from "../fixtures/paymentMethod";
import { PageManager } from "../pages/pageManager";
import { isMobile, isTablet } from "../utils/device";

test.describe("Checkout Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().goto();
    await pm.onHomePage().waitForReadyState("domcontentloaded");
  });

  test("✅ Loads checkout page from cart @smoke @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);

    // Add product and go to checkout
    await pm.onHomePage().navigateToCategory("headphones");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await expect(pm.onProductPage().addToCartButton).toBeVisible();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toHaveText("1");
    await pm.onHomePage().cartIcon.click();
    await expect(pm.onCartPage().checkoutButton).toBeVisible();
    await pm.onCartPage().checkoutButton.click();
    await expect(page).toHaveURL(/.*checkout.*/);
    await expect(pm.onCheckoutPage().checkoutTitle).toBeVisible();
  });

  test("✅ Fill billing details and submit order @positive @regression @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("speakers");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toHaveText("1");
    await pm.onHomePage().cartIcon.click();

    // Wait for checkout button to be enabled before clicking
    await expect(pm.onCartPage().checkoutButton).toBeEnabled();
    await pm.onCartPage().checkoutButton.click();

    await expect(pm.onCheckoutPage().checkoutTitle).toBeVisible();
    await expect(pm.onCheckoutPage().checkoutTitle).toBeVisible();
    await pm.onCheckoutPage().fillBillingDetails(testData.billing.john);
    await pm.onCheckoutPage().selectPaymentMethod(PaymentMethod.CashOnDelivery);
    await pm.onCheckoutPage().submitOrder();

    // Assert summary or confirmation appears
    await expect(pm.onCheckoutPage().summarySection).toBeVisible();
  });

  test("❌ Required fields validation shows error @negative @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("earphones");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toHaveText("1");
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().checkoutButton.click();

    // Leave fields empty and submit
    await pm.onCheckoutPage().submitOrder();

    // Assert error messages are visible
    await expect(pm.onCheckoutPage().errorMessages.first()).toBeVisible();
  });

  test("✅ Select payment method Cash on Delivery @positive @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("headphones");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await pm.onProductPage().addToCartButton.click();
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().checkoutButton.click();

    await pm.onCheckoutPage().selectPaymentMethod(PaymentMethod.CashOnDelivery);
    await expect(page.getByLabel("Cash on Delivery")).toBeChecked();
  });

  test("✅ Fill e-Money payment details and submit order @positive @regression @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("speakers");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await pm.onProductPage().addToCartButton.click();
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().checkoutButton.click();

    await pm.onCheckoutPage().selectPaymentMethod(PaymentMethod.EMoney);
    await pm.onCheckoutPage().fillBillingDetails(testData.billing.jane);
    await pm.onCheckoutPage().submitOrder();
    await expect(pm.onCheckoutPage().summarySection).toBeVisible();
  });

  test("❌ e-Money payment fields required validation @negative @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("speakers");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await pm.onProductPage().addToCartButton.click();
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().checkoutButton.click();

    await pm.onCheckoutPage().selectPaymentMethod(PaymentMethod.EMoney);
    await pm.onCheckoutPage().fillBillingDetails(
      // eMoneyNumber and eMoneyPin intentionally omitted
      testData.billing.janeWithoutEMoney
    );
    await pm.onCheckoutPage().submitOrder();
    await expect(
      pm.onCheckoutPage().errorMessages.getByText("please type your enum")
    ).toBeVisible();
  });

  test("✅ Checkout confirmation popup appears and is correct @positive @regression @ui", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().navigateToCategory("speakers");
    await pm.onHomePage().waitForReadyState("domcontentloaded");
    await pm.onCategoryPage().firstProductButton.click();
    await pm.onProductPage().addToCartButton.click();
    await expect(pm.onHomePage().cartItemCount).toHaveText("1");
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().checkoutButton.click();

    await pm.onCheckoutPage().fillBillingDetails(testData.billing.john);
    await pm.onCheckoutPage().selectPaymentMethod(PaymentMethod.CashOnDelivery);
    await pm.onCheckoutPage().submitOrder();

    // Validate confirmation popup
    await expect(pm.onCheckoutPage().confirmationPopup).toBeVisible();
    await expect(pm.onCheckoutPage().confirmationTitle).toBeVisible();
    await expect(pm.onCheckoutPage().confirmationOrderSummary).toBeVisible();
    await expect(pm.onCheckoutPage().confirmationGrandTotal).toBeVisible();
    await expect(pm.onCheckoutPage().confirmationBackHomeButton).toBeVisible();
    await expect(pm.onCheckoutPage().confirmationBackHomeButton).toBeEnabled();
    await pm.onCheckoutPage().confirmationBackHomeButton.click();
    await expect(page).toHaveURL("/audiophille-ecommerce");
  });
});

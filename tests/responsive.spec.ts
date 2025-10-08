import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { isMobile, isTablet } from "../utils/device";
import { PageManager } from "../pages/pageManager";

test.describe("Responsive Smoke @responsive @ui", () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.waitForReadyState("domcontentloaded");
  });

  test("Viewport: hero + nav visible", async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.logo).toBeVisible();
    await expect(home.heroSection).toBeVisible();
    if (!isMobile()) {
      await expect(home.headphonesLink).toBeVisible();
    }
  });

  test("Category navigation works on form factor", async ({ page }) => {
    const home = new HomePage(page);
    if (isMobile()) {
      await home.resHamburgerMenu.click();
      await home.resHeadphonesLink.click();
    } else {
      await home.headphonesLink.click();
    }
    await expect(page).toHaveURL(/headphones/i);
    await page.goBack();
    if (isMobile()) {
      await home.resHamburgerMenu.click();
      await home.resSpeakersLink.click();
    } else {
      await home.speakersLink.click();
    }
    await expect(page).toHaveURL(/speakers/i);
  });

  test("Cart icon present across breakpoints", async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.cartIcon).toBeVisible();
    if (isTablet()) {
      await expect(home.footer).toBeVisible();
    }
  });

  test("✅ Responsive: add product to cart (minimal flow) @responsive @smoke", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    // Navigate to Headphones (handle mobile menu if needed)
    if (isMobile()) {
      const home = pm.onHomePage();
      await home.resHamburgerMenu.click();
      await home.resHeadphonesLink.click();
    } else {
      await pm.onHomePage().navigateToCategory("headphones");
    }
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    const count = await pm.onCartPage().getItemCount();
    await expect(count).toBe(1);
    await expect(pm.onCartPage().checkoutButton).toBeEnabled();
  });

  test("✅ Responsive: reach checkout after add-to-cart @responsive @smoke", async ({
    page,
  }) => {
    const pm = new PageManager(page);
    // Navigate to Speakers
    if (isMobile()) {
      const home = pm.onHomePage();
      await home.resHamburgerMenu.click();
      await home.resSpeakersLink.click();
    } else {
      await pm.onHomePage().navigateToCategory("speakers");
    }
    await pm.onCategoryPage().openFirstProduct();
    await pm.onProductPage().addToCartButton.click();
    await pm.onHomePage().cartIcon.click();
    await pm.onCartPage().waitForReady();
    await pm.onCartPage().checkoutButton.click();
    await expect(pm.onCheckoutPage().checkoutTitle).toBeVisible();
  });
});

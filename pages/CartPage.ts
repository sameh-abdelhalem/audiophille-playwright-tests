import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly totalItemsCount: Locator;
  readonly singleItemQuantity: Locator;
  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator("button:has-text('Checkout')");
    this.cartItems = page.locator(".Cart_prodContainer__7HUNy");
    this.totalPrice = page
      .locator(".Cart_totalPrice__yfDpE")
      .getByRole("heading", { level: 6 });
    this.totalItemsCount = page
      .locator(".Cart_cartHeader__QFTZN")
      .getByRole("heading", { level: 6 });
    this.singleItemQuantity = page
      .locator(".Cart_quantity__vTgoG")
      .locator("div")
      .nth(1);
  }

  async extractNumberFromText(textLocator: Locator) {
    const text = await textLocator.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
  async getItemCount() {
    return await this.cartItems.count();
  }

  async assertEmptyCart() {
    await expect(
      this.extractNumberFromText(this.totalItemsCount)
    ).resolves.toBe(0);
    await expect(this.checkoutButton).toBeDisabled();
  }

  async assertCartNotEmpty() {
    await expect(
      this.extractNumberFromText(this.totalItemsCount)
    ).resolves.not.toBe(0);
    await expect(this.cartItems.first()).toBeVisible();
    await expect(this.checkoutButton).toBeEnabled();
  }

  async removeAllItems() {
    const removeButton = this.page
      .locator(".Cart_cartHeader__QFTZN")
      .getByText("Remove all");
    await removeButton.click();
  }
}

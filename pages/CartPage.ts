import { Page, Locator, expect } from "@playwright/test";
import { parsePrice } from "../utils/price";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly totalItemsCount: Locator;
  readonly singleItemQuantity: Locator;
  readonly plusButton: Locator;
  readonly minusButton: Locator;
  readonly cartHeader: Locator;
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
    this.plusButton = page
      .locator(".Cart_quantity__vTgoG")
      .locator(".Cart_amount__OVEt9", { hasText: "+" });
    this.minusButton = page
      .locator(".Cart_quantity__vTgoG ")
      .locator(".Cart_amount__OVEt9", { hasText: "-" });
    this.cartHeader = page.locator(".Cart_cartHeader__QFTZN");
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

  getProductContainer(index: number) {
    return this.cartItems.nth(index);
  }

  getProductQuantity(index: number) {
    return this.getProductContainer(index)
      .locator(".Cart_quantity__vTgoG div")
      .nth(1);
  }

  getPlusButton(index: number) {
    return this.getProductContainer(index).locator(
      ".Cart_quantity__vTgoG .Cart_amount__OVEt9",
      { hasText: "+" }
    );
  }

  getMinusButton(index: number) {
    return this.getProductContainer(index).locator(
      ".Cart_quantity__vTgoG .Cart_amount__OVEt9",
      { hasText: "-" }
    );
  }

  async getQuantityValue(index: number) {
    const quantityLocator = this.getProductQuantity(index);
    return Number(await quantityLocator.textContent());
  }

  async getSingleItemQuantity() {
    return Number(await this.singleItemQuantity.textContent());
  }

  async getTotalPriceValue() {
    const raw = await this.totalPrice.textContent();
    return parsePrice(raw);
  }

  async waitForReady() {
    await this.cartHeader.waitFor({ state: "visible" });
    await this.checkoutButton.waitFor({ state: "attached" });
  }
}

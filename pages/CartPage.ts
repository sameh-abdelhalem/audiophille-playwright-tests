import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
 readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(".cart-item");
    this.checkoutButton = page.locator("button:has-text('Checkout')");
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

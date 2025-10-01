import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator(".product-title");
    this.addToCartButton = page.locator("button:has-text('Add to Cart')");
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}

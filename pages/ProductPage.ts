import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.getByRole("heading", { level: 2 }).first();
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.productDescription = this.productTitle
      .locator("..")
      .getByRole("paragraph")
      .first();
    this.productPrice = this.productTitle
      .locator("..")
      .getByRole("paragraph")
      .nth(1);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}

import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly plusButton: Locator;
  readonly minusButton: Locator;
  readonly quantityValue: Locator;

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
    this.plusButton = page
      .locator(".ProductDetails_amount__u-5E4")
      .getByText("+");
    this.minusButton = page
      .locator(".ProductDetails_amount__u-5E4")
      .getByText("-");
    this.quantityValue = page
      .locator(".ProductDetails_addToCart__qL7fe")
      .first()
      .locator("div", { hasNotText: "+" })
      .nth(1);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async getQuantityValue() {
    return Number(await this.quantityValue.textContent());
  }
}

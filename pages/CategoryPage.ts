import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CategoryPage extends BasePage {
  readonly categoryTitle: Locator;
  readonly firstProduct: Locator;
  readonly firstProductTitle: Locator;
  readonly firstProductButton: Locator;
  constructor(page: Page) {
    super(page);
    this.categoryTitle = page.locator("h2").first();
    this.firstProduct = page
      .locator(".ProductAd_prodAdContainer__R44X9")
      .first();

    this.firstProductTitle = this.firstProduct.getByRole("heading", {
      level: 2,
    });
    this.firstProductButton = this.firstProduct.getByRole("button");
  }

  async waitForFirstProduct() {
    await expect(this.firstProduct).toBeVisible();
    await expect(this.firstProductButton).toBeVisible();
  }

  async openFirstProduct() {
    await this.waitForFirstProduct();
    await this.firstProductButton.click();
  }
}

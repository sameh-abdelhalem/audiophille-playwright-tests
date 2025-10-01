import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CategoryPage extends BasePage {
  readonly categoryTitle: Locator;
  readonly firstProduct: Locator;
  readonly firstProductTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryTitle = page.locator("h2").first();
    this.firstProduct = page
      .locator(".ProductAd_prodAdContainer__R44X9")
      .first();
    this.firstProductTitle = this.firstProduct.locator("h2");
  }

  async navigateToCategory(category: "Headphones" | "Speakers" | "Earphones") {
    await this.page.click(`text=${category}`);
  }
}

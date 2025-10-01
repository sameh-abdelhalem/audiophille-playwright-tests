import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CategoryPage extends BasePage {
  readonly categoryTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryTitle = page.locator("h2").first();
  }

  async navigateToCategory(category: "Headphones" | "Speakers" | "Earphones") {
    await this.page.click(`text=${category}`);
  }
}

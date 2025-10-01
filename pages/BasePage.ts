import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = "/") {
    await this.page.goto(`audiophille-ecommerce${path}`);
  }

  async getTitle() {
    return this.page.title();
  }
  async navigateToCategory(category: "Headphones" | "Speakers" | "Earphones") {
    await this.page.click(`text=${category}`);
  }
}

import { Page, Locator } from "@playwright/test";

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

  async navigateToCategory(category: "headphones" | "speakers" | "earphones") {
    await this.clickByText(category);
  }

  async clickByText(text: string) {
    await this.page.locator("header").getByRole("link", { name: text }).click();
  }

  getByRole(role: string, options?: Record<string, any>): Locator {
    return this.page.getByRole(role as any, options);
  }

  async waitForUrl(urlPart: string) {
    await this.page.waitForURL(urlPart);
  }

  async reload() {
    await this.page.reload();
  }
}

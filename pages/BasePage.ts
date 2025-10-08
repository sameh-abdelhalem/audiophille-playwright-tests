import { Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = "/") {
    await this.page.goto(`audiophille-ecommerce${path}`);
  }

  async navigateToCategory(category: "headphones" | "speakers" | "earphones") {
    await this.clickByText(category);
  }

  async clickByText(text: string) {
    await this.page.locator("header").getByRole("link", { name: text }).click();
  }

  async waitForUrl(urlPart: string) {
    await this.page.waitForURL(urlPart);
  }

  async reload() {
    await this.page.reload();
  }

  // --- Added defensive waits ---
  async waitForReadyState(
    state: "load" | "domcontentloaded" | "networkidle" = "load"
  ) {
    await this.page.waitForLoadState(state);
  }

  async waitForNetworkIdle() {
    // Swallow occasional timeouts on static hosting
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }
}

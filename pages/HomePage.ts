import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly headphonesLink: Locator;
  readonly speakersLink: Locator;
  readonly earphonesLink: Locator;

  constructor(page: Page) {
    super(page);
    this.headphonesLink = page.locator("text=Headphones");
    this.speakersLink = page.locator("text=Speakers");
    this.earphonesLink = page.locator("text=Earphones");
  }

  async navigateToCategory(category: "Headphones" | "Speakers" | "Earphones") {
    await this.page.click(`text=${category}`);
  }
}

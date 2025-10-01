import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly headphonesLink: Locator;
  readonly speakersLink: Locator;
  readonly earphonesLink: Locator;
  readonly homeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page
      .getByRole("banner")
      .locator(".SecondaryNavigation_logo__lsEYe");
    this.headphonesLink = page
      .locator("header")
      .getByRole("link", { name: "Headphones" });
    this.speakersLink = page
      .locator("header")
      .getByRole("link", { name: "Speakers" });
    this.earphonesLink = page
      .locator("header")
      .getByRole("link", { name: "Earphones" });
    this.homeLink = page
      .locator("header")
      .getByRole("link", { name: "Home" });
  }
}

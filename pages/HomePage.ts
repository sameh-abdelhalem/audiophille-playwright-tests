import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly headphonesLink: Locator;
  readonly speakersLink: Locator;
  readonly earphonesLink: Locator;
  readonly homeLink: Locator;
  readonly heroSection: Locator;
  readonly seeProductButton: Locator;
  readonly categoryCards: Locator;
  readonly cartIcon: Locator;
  readonly footer: Locator;

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
    this.homeLink = page.locator("header").getByRole("link", { name: "Home" });
    this.heroSection = page.locator(".SecondaryNavigation_hero__XtHd1");
    this.seeProductButton = page
      .locator(".SecondaryNavigation_hero__XtHd1")
      .getByRole("button", { name: /see product/i });
    this.categoryCards = page
      .locator(".ProductCategories_products__esqWM")
      .locator("a");
    this.cartIcon = page.locator("svg.fa-cart-shopping");
    this.footer = page.locator(".Footer_footerContainer__oq9TB");
  }
}

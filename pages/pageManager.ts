import { Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
export class PageManager {
  private readonly page: Page;
  private readonly homePage: HomePage;
  private readonly categoryPage: CategoryPage;
  private readonly productPage: ProductPage;
  private readonly cartPage: CartPage;
  private readonly checkoutPage: CheckoutPage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(this.page);
    this.categoryPage = new CategoryPage(this.page);
    this.productPage = new ProductPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
  }

  onHomePage() {
    return this.homePage;
  }
  onCategoryPage() {
    return this.categoryPage;
  }
  onProductPage() {
    return this.productPage;
  }
  onCartPage() {
    return this.cartPage;
  }
  onCheckoutPage() {
    return this.checkoutPage;
  }
}

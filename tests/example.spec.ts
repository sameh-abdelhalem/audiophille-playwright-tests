// import { test, expect } from "@playwright/test";
// import { HomePage } from "../pages/HomePage";
// import { ProductPage } from "../pages/ProductPage";
// import { CartPage } from "../pages/CartPage";
// import { testData } from "../fixtures/testData";

// test.describe("ECommerce App", () => {
//   test("should load home, shop, add product to cart, and checkout", async ({
//     page,
//   }) => {
//     const homePage = new HomePage(page);
//     await homePage.goto();

//     await page.waitForSelector(`text=${testData.productName}`);

//     const productPage = new ProductPage(page);
//     await expect(productPage.productTitle).toHaveText(testData.productName);
//     await productPage.addToCart();

//     const cartPage = new CartPage(page);
//     await cartPage.goto("/cart");
//     await expect(cartPage.cartItems).toContainText(testData.productName);
//     await cartPage.checkout();
//   });
// });

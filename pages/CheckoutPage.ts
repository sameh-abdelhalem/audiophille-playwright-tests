import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { PaymentMethod } from "../fixtures/paymentMethod";

export class CheckoutPage extends BasePage {
  readonly checkoutTitle: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly zipInput: Locator;
  readonly cityInput: Locator;
  readonly countryInput: Locator;
  readonly continueButton: Locator;
  readonly summarySection: Locator;
  readonly errorMessages: Locator;
  readonly eMoneyNumberInput: Locator;
  readonly eMoneyPinInput: Locator;
  readonly confirmationPopup: Locator;
  readonly confirmationTitle: Locator;
  readonly confirmationOrderSummary: Locator;
  readonly confirmationGrandTotal: Locator;
  readonly confirmationBackHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutTitle = page.getByRole("heading", { name: /checkout/i });
    this.nameInput = page
      .locator(".CheckoutForm_adjInputs__nyb75")
      .getByLabel("Name");
    this.emailInput = page.getByLabel("Email Address");
    this.phoneInput = page.getByLabel("Phone Number");
    this.addressInput = page
      .getByText("shipping info")
      .locator("..")
      .getByLabel("Address");
    this.zipInput = page.getByLabel("ZIP Code");
    this.cityInput = page.getByLabel("City").first();
    this.countryInput = page.getByLabel("Country");
    this.continueButton = page.getByRole("button", { name: /continue/i });
    this.summarySection = page.locator(".CheckoutSummary_container__z6thj");
    this.errorMessages = page.locator(".CheckoutForm_error__s-BpP");
    this.eMoneyNumberInput = page.getByLabel("e-Money Number");
    this.eMoneyPinInput = page.getByLabel("e-Money PIN");
    this.confirmationPopup = page.locator(
      ".OrderConfirmation_confirmationContainer__lP42H"
    );
    this.confirmationTitle = this.confirmationPopup.getByRole("heading", {
      name: /Thank You For Your Order/i,
    });
    this.confirmationOrderSummary = page.locator(
      ".OrderConfirmation_confirmationText__-kpWZ"
    );

    this.confirmationGrandTotal = this.confirmationPopup.locator(
      ".OrderConfirmation_priceTextContainer__ctnzs"
    );
    this.confirmationBackHomeButton = this.confirmationPopup.getByRole(
      "button",
      { name: /back to home/i }
    );
  }

  async fillBillingDetails(details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    eMoneyNumber?: string;
    eMoneyPin?: string;
  }) {
    await this.nameInput.fill(details.name);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.addressInput.fill(details.address);
    await this.zipInput.fill(details.zip);
    await this.cityInput.fill(details.city);
    await this.countryInput.selectOption({ label: details.country });
    if (details.eMoneyNumber) {
      await this.eMoneyNumberInput.fill(details.eMoneyNumber);
    }
    if (details.eMoneyPin) {
      await this.eMoneyPinInput.fill(details.eMoneyPin);
    }
  }

  async selectPaymentMethod(method: PaymentMethod) {
    await this.page.getByLabel(method).check();
  }

  async submitOrder() {
    await this.continueButton.click();
  }
}

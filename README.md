# Audiophille E-Commerce – Playwright Tests

End-to-end UI automation for:  
https://sameh-abdelhalem.github.io/audiophille-ecommerce/

## Highlights

- Playwright + TypeScript
- Page Object Model + PageManager
- Cross browser (Chromium / Firefox / WebKit)
- Cart, product, checkout (incl. e‑Money) coverage
- Tags: @smoke @ui @positive @negative @regression
- Utilities: parsePrice, PaymentMethod enum

## Structure

```
pages/        page objects
tests/        spec files
fixtures/     test data + enums
utils/        helpers (price)
playwright.config.ts
```

## Install & Run

```bash
npm install
npx playwright install
npx playwright test
```

Run subset:

```bash
npx playwright test -g "@smoke"
```

Headed:

```bash
npx playwright test --headed --project=chromium
```

## Common Tags

| Tag         | Use                |
| ----------- | ------------------ |
| @smoke      | Fast critical path |
| @regression | Wider coverage     |
| @ui         | DOM / visual       |
| @positive   | Happy flow         |
| @negative   | Validation         |

## Key Pages Covered

- Product details (content + imagery)
- Cart (add, multi-item, quantity, pricing, persistence)
- Checkout (billing, payment selection, e‑Money validation, confirmation modal)

## Utilities

| Utility / Enum       | Purpose                               |
| -------------------- | ------------------------------------- |
| `parsePrice(text)`   | Strips currency / formatting → number |
| `PaymentMethod` enum | Avoids repeating payment strings      |
| `PageManager`        | Central page accessor factory         |

## Flakiness Mitigation

- waitForReadyState
- cartPage.waitForReady
- openFirstProduct helper
- Prefer expect(...).toBeVisible() over manual timeouts

## Future Ideas

- Accessibility scan (axe-core)
- API + contract tests
- Mobile viewport matrix
- Visual diff workflow (could be added later)

## Contact

GitHub: https://github.com/sameh-abdelhalem

---

Short by design. Add depth only if a reviewer asks.
npx playwright install
npx playwright test

````

Headed mode:
```bash
npx playwright test --headed --project=chromium
````

Single test file:

```bash
npx playwright test tests/cart.spec.ts
```

Specific test by title:

```bash
npx playwright test -g "Checkout confirmation"
```

---

## 🔐 Checkout Coverage Highlights

- Billing form required fields
- Payment method selection (e‑Money vs Cash)
- Conditional e‑Money Number & PIN validation
- Order confirmation modal + grand total extraction (`parsePrice`)

---

## 🛒 Cart Coverage Highlights

- Empty state + disabled checkout
- Single & multiple product add
- Quantity update (+ / -) and removal logic
- Price recalculation after quantity change
- Multi‑product decrement to removal
- Persistence during navigation

---

## 🧩 Utilities

| Utility / Enum       | Purpose                                 |
| -------------------- | --------------------------------------- |
| `parsePrice(text)`   | Strips currency / formatting → number   |
| `PaymentMethod` enum | Eliminates string literals in tests     |
| `PageManager`        | Central page accessor (avoids new spam) |

---

## 🛡 Flakiness Mitigation

| Technique                  | Example                                 |
| -------------------------- | --------------------------------------- |
| Explicit readiness wait    | `waitForReadyState("domcontentloaded")` |
| Component readiness (cart) | `cartPage.waitForReady()`               |
| Stable product access      | `categoryPage.openFirstProduct()`       |
| Avoid arbitrary timeouts   | Using `expect(...).toBeVisible()`       |
| Controlled visual runs     | `VISUAL` gating                         |

---

## ➕ Adding a New Test (Example)

```ts
test("✅ Product price parses as number @ui", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.onHomePage().navigateToCategory("speakers");
  await pm.onCategoryPage().openFirstProduct();
  const priceText = await pm.onProductPage().productPrice.textContent();
  // reuse parsePrice if imported
});
```

---

## 🧪 CI Suggestions (If Added)

Typical GitHub Actions steps:

1. Checkout
2. Install dependencies + browsers (`npx playwright install --with-deps`)
3. Run smoke: `npx playwright test -g "@smoke"`
4. Run full regression
5. Optionally run `VISUAL=1` job (Chromium only)

---

## 🧰 Useful Commands

| Action                   | Command                                 |
| ------------------------ | --------------------------------------- |
| Update browsers          | `npx playwright install`                |
| Show last report         | `npx playwright show-report`            |
| Trace open (failed test) | `npx playwright show-trace trace.zip`   |
| Debug mode               | `PWDEBUG=1 npx playwright test`         |
| Single project           | `npx playwright test --project=firefox` |

---

## 🔍 Troubleshooting

| Symptom                             | Fix                                                             |
| ----------------------------------- | --------------------------------------------------------------- |
| Timeout clicking first product      | Ensure `openFirstProduct()` is used                             |
| Checkout button disabled in Firefox | Use `cartPage.waitForReady()`                                   |
| Visual job slow                     | Disable VISUAL (remove env var)                                 |
| Price assertion failing             | Confirm price text matches `$ 1234` pattern                     |
| Element not found after navigation  | Insert `waitForReadyState("domcontentloaded")` after navigation |

---

## 🧭 Design Choices (Brief)

- **PageManager**: Centralizes lazy instantiation, reduces test boilerplate.
- **Minimal BasePage**: Only essential helpers to avoid abstraction bloat.
- **Targeted Visuals**: Only capture UI checkpoints that matter (hero/product/cart/checkout).
- **Defensive Locators**: Prefer role/text-backed queries over brittle CSS where possible.
- **Tagging**: Enables selective pipelines (smoke vs regression vs visual).

---

## 📈 Future Enhancements

- Accessibility smoke (axe-core)
- API layer + contract validation
- Visual diff gating in PR workflow
- Data builder for negative billing cases
- Mobile viewport matrix

---

## 🤝 Contributing (Portfolio Context)

This is a personal showcase project. Suggestions / forks welcome.

---

## 📜 License

MIT (Feel free to reuse framework patterns.)

---

## 🙋 Contact

Reach out via GitHub profile: https://github.com/sameh-abdelhalem

---

Happy Testing! 🚀

- Data builder for negative billing cases
- Mobile viewport matrix

---

## 🤝 Contributing (Portfolio Context)

This is a personal showcase project. Suggestions / forks welcome.

---

## 📜 License

MIT (Feel free to reuse framework patterns.)

---

## 🙋 Contact

Reach out via GitHub profile: https://github.com/sameh-abdelhalem

---

Happy Testing! 🚀

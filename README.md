# 🎧 Audiophille E-Commerce Automated Tests

This repository contains **end-to-end UI automation tests** for my [Audiophille E-Commerce website](https://sameh-abdelhalem.github.io/audiophille-ecommerce/), built with **Playwright + TypeScript**.  

The goal of this project is to showcase a **professional test automation framework** using Page Object Model (POM) design, CI/CD integration with GitHub Actions, and detailed reporting.  

---

## 🚀 Features
- ✅ Automated navigation, product, and cart flows  
- ✅ Page Object Model (POM) design pattern  
- ✅ Cross-browser testing (Chromium, Firefox, WebKit)  
- ✅ CI/CD with GitHub Actions  
- ✅ HTML test reports with screenshots  

---

## 📂 Project Structure
- `tests/` → Test specs (navigation, product, cart, checkout)  
- `page-objects/` → Page Object Model classes  
- `utils/` → Test data & helpers  
- `.github/workflows/` → CI/CD pipeline (GitHub Actions)  

---

## ▶️ Run Tests Locally
```bash
git clone https://github.com/sameh-abdelhalem/audiophille-playwright-tests.git
cd audiophille-playwright-tests
npm install
npx playwright test

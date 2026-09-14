import { test as baseTest } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { CsvHelper } from "../utils/CsvHelper";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductInfoPage } from "../pages/ProductInfoPage";
import { BasePage } from "../pages/BasePage";
import { ApiHelper } from "../api/ApiHelper";

//define types for page fixtures
type pageFixtures = {
  basePage: BasePage;
  loginPage: LoginPage;
  homePage: HomePage;
  loginTestData: Record<string, string>[];
  searchResultsPage: SearchResultsPage;
  productInfoPage: ProductInfoPage;
};

//extend playwright base test:
export let test = baseTest.extend<pageFixtures>({
  basePage: async ({ page }, use) => {
    let basePage = new BasePage(page);
    await use(basePage);
  },

  loginPage: async ({ page }, use) => {
    let loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    let homePage = new HomePage(page);
    await use(homePage);
  },
  searchResultsPage: async ({ page }, use) => {
    let searchResultsPage = new SearchResultsPage(page);
    await use(searchResultsPage);
  },
  productInfoPage: async ({ page }, use) => {
    let productInfoPage = new ProductInfoPage(page);
    await use(productInfoPage);
  },

  loginTestData: async ({}, use) => {
    let loginTestData = CsvHelper.readCsv("src/data/loginData.csv");
    await use(loginTestData);
  },
});

export { expect } from "@playwright/test";

import { expect, test } from "@playwright/test";

import { LoginPage } from "../../src/pages/LoginPage";
import { HomePage } from "../../src/pages/HomePage";

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  homePage = new HomePage(page);
  await loginPage.goToLoginPage();
  await loginPage.doLogin("pwtestbatch@open.com", "pw123");
  expect(await homePage.logoutLinkExists()).toBeTruthy();
  expect(await homePage.getPageTitle()).toBe("My Account");
});

test("HomePage Title test", async ({}) => {
  expect(await homePage.getPageTitle()).toBe("My Account");
});

test("verify home page header count", async ({}) => {
  expect(await homePage.getHomePageHeadersCount()).toBe(4);
});

test("does logout link exist", async ({}) => {
  expect(await homePage.logoutLinkExists()).toBeTruthy();
});

test("get homepage headers text", async ({}) => {
  expect.soft(await homePage.getHomePageHeadersCount()).toBe(4);

  let allHeaders = await homePage.getHomePageHeaders();
  expect.soft(allHeaders).toHaveLength(4);

  console.log(allHeaders);

  expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
});

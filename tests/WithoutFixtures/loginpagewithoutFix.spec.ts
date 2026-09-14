import { test, expect, Page } from "@playwright/test";

import { LoginPage } from "../../src/pages/LoginPage";
import { HomePage } from "../../src/pages/HomePage";

let loginpage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  loginpage = new LoginPage(page);
  await loginpage.goToLoginPage();
  homePage = new HomePage(page);
});

test("login page title test", async ({}) => {
  //   let loginpage = new LoginPage(page);

  //   await loginpage.goToLoginPage();

  let title = await loginpage.getLoginPageTitle();
  console.log(title);
  expect(title).toBe("Account Login");
});

test("forgotpwdlink exist test", async ({}) => {
  //   let loginPage = new LoginPage(page);
  //   await loginPage.goToLoginPage();
  expect(await loginpage.isForgotPwdLinkExist()).toBeTruthy();
});

test("user is able to login to app test", async ({}) => {
  await loginpage.doLogin("pwtestbatch@open.com", "pw123");
  expect.soft(await homePage.logoutLinkExists()).toBeTruthy();
  expect(await homePage.getPageTitle()).toBe("My Account");
});

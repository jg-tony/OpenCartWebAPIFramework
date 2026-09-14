import { test, expect } from "../src/fixtures/pagefixture";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  expect.soft(await loginPage.getLoginPageTitle()).toBe("Account Login");
  await loginPage.doLogin(process.env.USERNAME!, process.env.PASSWORD!);
});

test("home page title test", async ({ homePage }) => {
  const homePageTitle = await homePage.getPageTitle();
  expect(homePageTitle).toBe("My Account");
});

test("Verify Logout Link Exists", async ({ homePage }) => {
  expect(await homePage.logoutLinkExists()).toBeTruthy();
});

test("Verify homePage headers exists", async ({ homePage }) => {
  let allHeaders = await homePage.getHomePageHeaders();
  console.log("home page headers: ", allHeaders);
  expect.soft(allHeaders).toHaveLength(4);
  expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
});

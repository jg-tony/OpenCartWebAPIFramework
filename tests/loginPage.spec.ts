import { test, expect } from "../src/fixtures/pagefixture";
import { CsvHelper } from "../src/utils/CsvHelper";
import { ExcelHelper } from "../src/utils/ExcelHelper";
import { JsonHelper } from "../src/utils/JsonHelper";

test.beforeEach(async ({ loginPage, homePage }) => {
  await loginPage.goToLoginPage();
  expect.soft(await homePage.getPageTitle()).toBe("Account Login");
});

test("Loginpage title Test", async ({ loginPage }) => {
  let loginPageTitle = await loginPage.getLoginPageTitle();
  console.log("login page title = ", loginPageTitle);
  expect(loginPageTitle).toBe("Account Login");
});

test("Verify forgot password link exists", async ({ loginPage }) => {
  expect(await loginPage.isForgotPwdLinkExist()).toBeTruthy();
});

test("Login as user and verify logout link exists", async ({ loginPage, homePage }) => {
  await loginPage.doLogin(process.env.USERNAME!, process.env.PASSWORD!);
  expect.soft(await homePage.getPageTitle()).toBe("My Account");
  expect(await homePage.logoutLinkExists()).toBeTruthy();
});

//sequence mode - 1 test is running with test data one by one.
test.skip("login to app using wrong credentails with Data driven test", async ({ loginPage, loginTestData }) => {
  for (let row of loginTestData) {
    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  }
});

//without test fixtures, paralle mode. read csv data directly and loop the test method row wise

let testData = CsvHelper.readCsv("src/data/csvData/loginData.csv");
for (let row of testData) {
  test(`Invalid login test ${row.username}, ${row.password}`, async ({ loginPage }) => {
    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  });
}

let testData1 = ExcelHelper.readExcel("src/data/ExcelLoginData/opencartTestData1.xlsx", "login");
for (let row1 of testData1) {
  test(`Invalid login test with excel data-  ${row1.username}, ${row1.password}`, async ({ loginPage }) => {
    await loginPage.doLogin(row1.username, row1.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  });
}

let loginJsonData = JsonHelper.readJson("src/data/jsonData/loginData.json");
for (let row2 of loginJsonData) {
  test(`Invalid login test with JSON data-  ${row2.username}, ${row2.password}`, async ({ loginPage }) => {
    await loginPage.doLogin(row2.username, row2.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  });
}

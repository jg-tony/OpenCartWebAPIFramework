import { test, expect } from "../src/fixtures/pagefixture";
import { CsvHelper } from "../src/utils/CsvHelper";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.doLogin(process.env.USERNAME!, process.env.PASSWORD!);
});

test("Verify search results count", async ({ homePage, searchResultsPage }) => {
  await homePage.doSearch("macbook");
  let count = await searchResultsPage.getProductSearchResultsCount();
  console.log("results count:", count);
  expect(count).toBe(3);
});

test("Verify user is able to land on product page", async ({ homePage, searchResultsPage, page }) => {
  await homePage.doSearch("macbook");
  await searchResultsPage.selectProduct("MacBook Pro");
  expect(await page.title()).toBe("MacBook Pro");
});

//test data through csv
//Data provider
const porductData = CsvHelper.readCsv("src/data/csvData/product.csv");

for (let row of porductData) {
  test(`verify Search result count - ${row.searchKey} and  ${row.productName} `, async ({
    homePage,
    searchResultsPage,
  }) => {
    await homePage.doSearch(row.searchKey);
    expect(await searchResultsPage.getProductSearchResultsCount()).toBe(Number(row.resultCount));
  });
}

for (let row of porductData) {
  test(`Verify user is landed on product page  -${row.searchKey} - ${row.productName}`, async ({
    homePage,
    searchResultsPage,
    page,
  }) => {
    await homePage.doSearch(row.searchKey);
    await searchResultsPage.selectProduct(row.productName);
    expect(await page.title()).toBe(row.productName);
  });
}

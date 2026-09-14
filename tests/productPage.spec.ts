import { test, expect } from "../src/fixtures/pagefixture";
import { CsvHelper } from "../src/utils/CsvHelper";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.doLogin(process.env.USERNAME!, process.env.PASSWORD!);
});

test("comp logo exists on product page with product page destructure", async ({ productInfoPage }) => {
  expect(await productInfoPage.isLogoVisible()).toBeTruthy();
});

test("verify footer visible in product page", async ({ productInfoPage }) => {
  expect(await productInfoPage.getPageFootersCount()).toBe(16);
});

test("comp logo exists on product page with BASE page destructure", async ({ basePage }) => {
  expect(await basePage.isLogoVisible()).toBeTruthy();
});

let testData = CsvHelper.readCsv("src/data/csvData/product.csv");

for (let row of testData) {
  test(`verify product info - ${row.searchKey}, ${row.productName}`, async ({
    homePage,
    searchResultsPage,
    productInfoPage,
  }) => {
    await homePage.doSearch(row.searchKey);
    await searchResultsPage.selectProduct(row.productName);
    console.log(await productInfoPage.getProductInfo());
    expect(await productInfoPage.getProductHeader()).toBe(row.productName);
    expect(await productInfoPage.getProductImagesCount()).toBe(Number(row.imageCount));
  });
}

for (let row of testData) {
  test(`verify product information/data ${row.searchKey}, ${row.productName}`, async ({
    homePage,
    searchResultsPage,
    productInfoPage,
  }) => {
    await homePage.doSearch(row.searchKey);
    await searchResultsPage.selectProduct(row.productName);
    let actualProductInfoMap = await productInfoPage.getProductInfo();
    console.log("Actual Product Details ", actualProductInfoMap);
    expect.soft(actualProductInfoMap.get("Product Header")).toBe(row.productName);
    expect.soft(actualProductInfoMap.get("ProductImages")).toBe(Number(row.imageCount));
    expect.soft(actualProductInfoMap.get("Brand")).toBe(row.brand);
    expect.soft(actualProductInfoMap.get("Proudct code")).toBe(row.productCode);
    if (row.rewardPoints) expect.soft(actualProductInfoMap.get("Reward Points")).toBe(row.rewardPoints);
    expect.soft(actualProductInfoMap.get("Availability")).toBe(row.availability);
    expect.soft(actualProductInfoMap.get("product Price")).toBe(row.productPrice);
    expect.soft(actualProductInfoMap.get("exTaxPrice")).toBe(row.exTaxPrice);
  });
}

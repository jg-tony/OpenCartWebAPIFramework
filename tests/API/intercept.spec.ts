import { test, expect } from "@playwright/test";

// web app ---> intercept the network call and log them
//** wild card -- matched all the urls */

test("intercept and log requests", async ({ page }) => {
  await page.route("**/*", async (route) => {
    console.log(route.request().method(), route.request().url());
    await route.continue(); //
  });

  await page.goto("https://naveenautomationlabs.com/opencart/index.php?route=common/home");
});

//intercept with mocking

//mocking: fake data/response

test("mock search data api", async ({ page }) => {
  let fakeProducts = [
    { name: "Fake MacBook Pro", price: "$599" },
    { name: "Fake iPhone 20", price: "$999" },
  ];

  await page.route("**/index.php?route=product/search&search=macbook", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fakeProducts),
    });
  });

  await page.goto("https://abc.com/index.php?route=product/search&search=macbook");

  let fakeJson = await page.evaluate(async () => {
    let fakeResponse = await fetch("https://abc.com/index.php?route=product/search&search=macbook");

    return await fakeResponse.json();
  });

  console.log("fake Json response: ", fakeJson);
});

import { test, expect } from "../src/fixtures/pagefixture";

// Example: grouping related tests with test.describe instead of splitting
// each test into its own file. All tests below share the same top-level
// beforeEach (login), and are further grouped by what they're verifying.

test.describe("Home Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    expect.soft(await loginPage.getLoginPageTitle()).toBe("Account Login");
    await loginPage.doLogin(process.env.USERNAME!, process.env.PASSWORD!);
  });

  test.describe("Page metadata", () => {
    test("shows the correct page title", async ({ homePage }) => {
      const homePageTitle = await homePage.getHomePageTitle();
      expect(homePageTitle).toBe("My Account");
    });
  });

  test.describe("Navigation", () => {
    test("logout link exists", async ({ homePage }) => {
      expect(await homePage.logoutLinkExists()).toBeTruthy();
    });
  });

  test.describe("Section headers", () => {
    test("shows all four expected headers", async ({ homePage }) => {
      const allHeaders = await homePage.getHomePageHeaders();
      expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
    });
  });
});

test.describe("Example: documenting a test's Given/When/Then + metadata", () => {
  // ---- Style A: plain comments (Selenium-style convention) ----
  // Test ID:  HP-003
  // Feature:  JIRA-4521 - Home page section headers
  // Author:   tonyjg.qa@gmail.com
  // Given:    a logged-in user lands on the My Account home page
  // When:     the page finishes loading
  // Then:     all four section headers are displayed in order
  //
  // Downside: none of the above is visible in the HTML report or trace
  // viewer - it only helps someone reading the raw source file.
  test("shows all four expected headers (comment style)", async ({ loginPage, homePage }) => {
    await loginPage.goToLoginPage();
    await loginPage.doLogin("pwtestbatch@open.com", "pw123");

    const allHeaders = await homePage.getHomePageHeaders();
    expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
  });

  // ---- Style B: native Playwright annotations + test.step ----
  // Same test id/feature/author info, but attached as structured
  // `annotation` metadata (shows in the HTML report's test details panel
  // and in the JSON reporter output), plus test.step() calls for
  // Given/When/Then (shows as a collapsible timeline in the HTML report
  // and trace viewer, with per-step timing).
  test(
    "shows all four expected headers (annotation + step style)",
    {
      annotation: [
        { type: "TestID", description: "HP-003" },
        { type: "Feature", description: "JIRA-4521 - Home page section headers" },
        { type: "Author", description: "tonyjg.qa@gmail.com" },
      ],
    },
    async ({ loginPage, homePage }) => {
      await test.step("Given a logged-in user lands on the My Account home page", async () => {
        await loginPage.goToLoginPage();
        await loginPage.doLogin("pwtestbatch@open.com", "pw123");
      });

      let allHeaders: string[] = [];
      await test.step("When the page finishes loading", async () => {
        allHeaders = await homePage.getHomePageHeaders();
      });

      await test.step("Then all four section headers are displayed in order", async () => {
        expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
      });
    },
  );
});

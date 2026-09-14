import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  //common header locators present on every page
  protected readonly logo: Locator;
  protected readonly search: Locator;
  protected readonly searchIcon: Locator;
  protected readonly footerLinks: Locator;
  protected readonly currency: Locator;
  protected readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByRole("img", { name: "naveenopencart" });
    this.search = page.getByRole("textbox", { name: "Search" });
    this.searchIcon = page.locator("div#search button");
    this.currency = page.getByRole("button", { name: "$ Currency" });
    this.footerLinks = page.locator("footer a");
    this.cartButton = page.locator("#cart");
  }

  //common actions

  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }

  async doSearch(searchKey: string): Promise<void> {
    console.log(`search key: ${searchKey}`);
    await this.search.fill(searchKey);
    await this.searchIcon.click();
  }

  async clickOnCartButton(): Promise<void> {
    await this.cartButton.click();
  }
  async isSearchBoxVisible(): Promise<boolean> {
    return await this.search.isVisible();
  }

  async getPageFootersCount(): Promise<number> {
    return await this.footerLinks.count();
  }

  async getPageFooter(): Promise<string[]> {
    return await this.footerLinks.allInnerTexts();
  }

  async isCurrencyBoxVisible(): Promise<boolean> {
    return await this.currency.isVisible();
  }

  async isCartBtnVisible(): Promise<boolean> {
    return await this.cartButton.isVisible();
  }

  //page level generic methods:

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  getCurrentURL(): string {
    return this.page.url();
  }
  async waitForPageLoad() {
    await this.page.waitForLoadState("load");
  }
  async takeScreenshot(name: string) {
    return await this.page.screenshot({
      fullPage: true,
      path: `reports/screenshot/${name}.png`,
    });
  }
}

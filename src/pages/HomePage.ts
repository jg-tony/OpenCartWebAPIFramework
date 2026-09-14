import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  //private readonly locators
  private readonly logoutLink: Locator;
  private readonly headers: Locator;

  //constructor

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.headers = page.getByRole("heading", { level: 2 });
  }

  //actions methods

  async logoutLinkExists(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  async getHomePageHeadersCount(): Promise<number> {
    return await this.headers.count();
  }

  async getHomePageHeaders(): Promise<string[]> {
    return await this.headers.allInnerTexts();
  }

  async doSearch(searchKey: string): Promise<void> {
    console.log(`search key: ${searchKey}`);
    await this.search.fill(searchKey);
    await this.searchIcon.click();
  }
}

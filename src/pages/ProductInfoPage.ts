import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductInfoPage extends BasePage {
  //private readonly
  private readonly productHeader: Locator;
  private readonly productImages: Locator;
  private readonly productMetaData: Locator;
  private readonly productPricing: Locator;
  private map: Map<string, string | number>;

  //constructor
  constructor(page: Page) {
    super(page);
    this.productHeader = page.getByRole("heading", { level: 1 });
    this.productImages = page.locator("div#content li img");
    this.productMetaData = page.locator("div#content ul.list-unstyled:nth-of-type(1) li");
    this.productPricing = page.locator("div#content ul.list-unstyled:nth-of-type(2) li");
    this.map = new Map<string, string | number>();
  }

  //actions
  async getProductHeader(): Promise<string> {
    return await this.productHeader.innerText();
  }

  async getProductImagesCount(): Promise<number> {
    await this.productImages.first().waitFor({ state: "visible" });
    return await this.productImages.count();
  }

  /**
   *
   * @returns this method is returning the actual product data: headers, images, metadata, pricing data
   */
  async getProductInfo(): Promise<Map<string, string | number>> {
    this.map.set("Product Header", await this.getProductHeader());
    this.map.set("ProductImages", await this.getProductImagesCount());
    await this.getProductMetaData();
    await this.getProductPricingData();
    return this.map;
  }

  private async getProductMetaData() {
    let metaData = await this.productMetaData.allInnerTexts();
    for (let data of metaData) {
      let meta = data.split(":");
      let metakey = meta[0].trim();
      let metaVal = meta[1].trim();
      this.map.set(metakey, metaVal);
    }
  }

  private async getProductPricingData() {
    let priceData = await this.productPricing.allInnerTexts();
    let productPrice = priceData[0].trim();
    let exTaxPrice = priceData[1].split(":")[1].trim();
    this.map.set("product Price", productPrice);
    this.map.set("exTaxPrice", exTaxPrice);
  }
}

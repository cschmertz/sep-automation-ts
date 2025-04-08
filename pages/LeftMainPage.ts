import { BasePage } from "./BasePage";
import { Locator } from 'playwright';

export class LeftMainPage extends BasePage {

  public readonly cydeoImageAtLeftWindow: Locator 
    = this.page.locator("(//img[@src = 'assets/images/logo.svg'])[2]");

  public readonly secureCheckout: Locator 
    = this.page.locator("//p[@class='checkout-title']");

  public readonly footerElements: Locator 
    = this.page.locator("//a[contains(@href, 'https://cydeo.com/')]");

  public readonly programName: Locator 
    = this.page.locator("//p[@class='course-name']/a");
    
  public readonly cydeoImageAtLeftWindowFooter: Locator
    = this.page.locator("//app-personal-details//div[2]/div[2]/div/a[1]/img");

  public readonly rightFooterText: Locator
    = this.page.locator("//div[contains(@class,'footer-right')]//p[.='Need help? Contact us at enrollment@cydeo.com']");
    
}
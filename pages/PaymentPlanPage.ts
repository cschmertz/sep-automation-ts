import { BasePage } from "./BasePage";
import { Locator } from 'playwright';

export class PaymentPlanPage extends BasePage {

  public readonly chooseAPaymentPlanText: Locator 
    = this.page.locator("//*[text()='Choose a payment plan']");

  public readonly upfrontPaymentOption: Locator 
    = this.page.locator("//span[@class='payment-type'][contains(text(),'Upfront')]");

  public readonly upfrontPaymentAmount: Locator 
    = this.page.locator("//span[@class='discount-price']");

  public readonly payOnceTextUpFront: Locator 
    = this.page.locator("//span[@class='discount-price']/span");

  public readonly upfrontPaymentFrame: Locator 
    = this.page.locator("(//mat-expansion-panel-header[@role='button'])[1]");

  public readonly greenBadgeUpfrontDiscount: Locator 
    = this.page.locator("//span[@class='chip-content']");

  public readonly greenBadgeElectricBoltUpfrontDiscount: Locator 
    = this.page.locator("//span[@class='chip-content']/span[@class='material-symbols-outlined light-icon']");

  public readonly greenBadgeTextUpfrontDiscount: Locator 
    = this.page.locator("//span[@class='chip-content']");

  public readonly couponAvailableBadgeUpfrontDiscount: Locator 
    = this.page.locator("//mat-chip[contains(@class, 'coupon-badge')]");

  public readonly couponBoxCloseBtnX: Locator 
    = this.page.locator('//*[@id="cdk-accordion-child-0"]/div/div/div[3]/mat-form-field/div[1]/div[2]/div[2]/button/span[3]');

  public readonly basePriceTextUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Base price')]");

  public readonly basePriceAmountUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Base price')]/following-sibling::span");

  public readonly upfrontDiscountTextUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Upfront')]");

  public readonly upfrontDiscountAmountUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Upfront')]/following-sibling::span");

  public readonly iHaveAPromoCodeButtonUnderUpfront: Locator 
    = this.page.locator("//button[contains(text(), 'I have a promo code')]");

  public readonly subtotalTextUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/div/span[contains(text(), 'Subtotal')]");

  public readonly subtotalAmountUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/div/span[contains(text(), 'Subtotal')]/following-sibling::span");

  public readonly excludingFeesTextUnderUpfront: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/i[contains(text(), 'excluding fees')]");

  public readonly installmentsPaymentOption: Locator 
    = this.page.locator("//span[@class='payment-type'][contains(text(),'Installments')]");

  public readonly installmentsPaymentFrame: Locator 
    = this.page.locator("(//mat-expansion-panel-header[@role='button'])[2]");

  public readonly installmentsPaymentAmount: Locator 
    = this.page.locator("//span[@class='discount-price ng-star-inserted']");

  public readonly perMonthTextInstallments: Locator 
    = this.page.locator("//span[@class='discount-price ng-star-inserted']/span");

  public readonly couponAvailableBadgeInstallments: Locator 
    = this.page.locator("(//mat-chip[contains(@class, 'coupon-badge')])[2]");

  public readonly basePriceTextUnderInstallments: Locator 
    = this.page.locator("//div[@class='content-panel-item coupon-section ng-star-inserted']/div/span[contains(text(), 'Base price')]");

  public readonly basePriceAmountUnderInstallments: Locator 
    = this.page.locator("//div[@class='content-panel-item coupon-section ng-star-inserted']/div/span[contains(text(), 'Base price')]/following-sibling::span");

  public readonly installmentsTextUnderInstallments: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Installments')]");

  public readonly installmentsNumberUnderInstallments: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Installments')]/following-sibling::span");

  public readonly pricePerInstallmentsTextUnderInstallments: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Price per installment')]");

  public readonly pricePerInstallmentsAmountUnderInstallments: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Price per installment')]/following-sibling::span");

  public readonly dueTodayTextUnderInstallments: Locator 
    = this.page.locator("//span[@class='sub-item-panel ng-star-inserted' and contains(text(), 'Due Today')]");

  public readonly firstMonthPaymentTextUnderInstallments: Locator 
    = this.page.locator("//div[@class='fee-items-holder']/span[contains(text(), 'First month')]");

  public readonly firstMonthPaymentAmountUnderInstallments: Locator 
    = this.page.locator("//div[@class='fee-items-holder']/span[contains(text(), 'First month')]/following-sibling::span");

  public readonly excludingFeesTextUnderInstallments: Locator 
    = this.page.locator("(//div[@class='content-panel-item ng-star-inserted']/i[contains(text(), 'excluding fees')])[2]");

  public readonly iHaveAPromoCodeButtonUnderInstallments: Locator 
    = this.page.locator("(//button[contains(text(), 'I have a promo code')])[2]");

  public readonly inactiveNextButton: Locator 
    = this.page.locator("//button[text()='Next']");

  public readonly activeNextButton: Locator 
    = this.page.locator("//button[@class = 'next-button' and text()='Next']");

  public readonly backButton: Locator 
    = this.page.locator("//span[@class='back-button']");

  public readonly footerText: Locator 
    = this.page.locator("(//p[@class = 'footer-text' and contains(text(), 'Need help?')])[2]");

  public readonly paymentPlanBoxes: Locator 
    = this.page.locator("//mat-accordion[@class='mat-accordion']/div/mat-expansion-panel/mat-expansion-panel-header");

  public readonly step1: Locator 
    = this.page.locator("//div[@class='step-circle'][contains(.,'1')]");

  public readonly step2: Locator 
    = this.page.locator("//div[@class='step-circle'][contains(.,'2')]");

  public readonly step3: Locator 
    = this.page.locator("//div[@class='step-circle'][contains(.,'3')]");

  public readonly UpfrontText: Locator 
    = this.page.locator("//span[@class='payment-type']");

  public readonly upfrontPaymentBorder: Locator 
    = this.page.locator("//*[@id='mat-expansion-panel-header-0']");

  public readonly installmentsPaymentBorder: Locator 
    = this.page.locator("//*[@id='mat-expansion-panel-header-1']");

  public readonly highlightBorder: string 
    = '2px solid rgb(40, 201, 251)';

  public readonly backgroundColor: string 
    = '#fff';

  public readonly upfrontField: Locator 
    = this.page.locator("#mat-expansion-panel-header-0");

  public readonly installmentsField: Locator 
    = this.page.locator("#mat-expansion-panel-header-1");

  public readonly upfrontPaymentOnce: Locator 
    = this.page.locator("//*[@id='mat-expansion-panel-header-0']/span/mat-panel-title/div/div/span[2]/span");

  public readonly expectedTexts: Locator[] = [
    this.chooseAPaymentPlanText,
    this.upfrontPaymentOption,
    this.upfrontPaymentAmount,
    this.installmentsPaymentOption,
    this.installmentsPaymentAmount,
  ];

  public async getSelectedPaymentOption(paymentPlan: string): Promise<Locator> {
    if (paymentPlan === 'Upfront') {
      return this.upfrontPaymentOption;
    } else if (paymentPlan === '5 Installments') {
      return this.installmentsPaymentOption;
    } else {
      throw new Error(`Payment plan "${paymentPlan}" is not recognized.`);
    }
  }

  public async getSelectedPaymentOptionBorder(paymentPlan: string): Promise<Locator> {
    if (paymentPlan === 'Upfront') {
      return this.upfrontPaymentBorder;
    } else if (paymentPlan === '5 Installments') {
      return this.installmentsPaymentBorder;
    } else {
      throw new Error(`Payment plan "${paymentPlan}" is not recognized.`);
    }
  }

  public async clickNewPaymentOption(paymentPlan: 'Upfront' | '5 Installments'): Promise<void> {
    if (paymentPlan === 'Upfront') {
        await this.installmentsPaymentOption.click();
    } else if (paymentPlan === '5 Installments') {
        await this.upfrontPaymentOption.click();
    } else {
        throw new Error(`Payment plan "${paymentPlan}" is not recognized.`);
    }
  }

  public async selectRandomPaymentOption(): Promise<void> {
    if (Math.random() < 0.5) {
        await this.upfrontPaymentOption.click();
        await this.activeNextButton.click();
    } else {
        await this.installmentsPaymentOption.click();
        await this.activeNextButton.click();
    }
  }
}

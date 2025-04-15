import { BasePage } from "./BasePage";
import { Locator, FrameLocator } from 'playwright';
import * as UserDataGenerator from '../utilities/UserDataGenerator';

export class ReviewPaymentPage extends BasePage {

  public readonly paymentForm: Locator 
    = this.page.locator("//form[@id='payment-form']");

  public readonly paymentFrame: FrameLocator 
    = this.page.frameLocator("(//iframe[contains(@title, 'Secure payment')])[1]");

  public readonly cardNumberInput: Locator 
    = this.paymentFrame.locator("(//input[@type='text'])[1]");

  public readonly expiryDateInput: Locator 
    = this.paymentFrame.locator("(//input[@type='text'])[2]");

  public readonly cvcInput: Locator 
    = this.paymentFrame.locator("(//input[@type='text'])[3]");

  public readonly countryDropDown: Locator 
    = this.paymentFrame.locator("//select[@name = 'country']");

  public readonly zipCodeInput: Locator 
    = this.paymentFrame.locator("(//input[@type='text'])[4]");

  public readonly byProvidingCardInformationText: Locator 
    = this.page.locator("//p[contains(., 'By providing your card information')]");

  public readonly productPriceText: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Product Price')]");

  public readonly productPriceAmount: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Product Price')]/following-sibling::span");

  public readonly installmentPriceText: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Installment Price')]");

  public readonly installmentPriceAmount: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Installment Price')]/following-sibling::span");

  public readonly subtotalText: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Subtotal')]");

  public readonly subtotalAmount: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Subtotal')]/following-sibling::span");

  public readonly processingFeeText: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Processing')]");

  public readonly processingFeeAmount: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Processing')]/following-sibling::span");

  public readonly totalText: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Total')]");

  public readonly totalAmount: Locator 
    = this.page.locator("//div[@class='content-panel-item ng-star-inserted']/span[contains(text(), 'Total')]/following-sibling::span");

  public readonly termsAndConditionsCheckbox: Locator 
    = this.page.locator("//input[@type = 'checkbox']");

  public readonly termsAndConditionsLink: Locator 
    = this.page.locator("//u[normalize-space()='Terms and Conditions']");

  public readonly payButton: Locator 
    = this.page.locator("//button[@type='button']");

  public readonly payButton2: Locator 
    = this.page.locator("//app-personal-details//div[3]//div[4]//div[1]//div[2]//div//button/span[4]");

  public readonly cardNumberErrorMessage: Locator 
    = this.paymentFrame.locator("//p[@id='Field-numberError' and @class='p-FieldError Error' and @role='alert']");

  public readonly backButton: Locator 
    = this.page.locator("(//span[@class='back-button'])[2]");

  public readonly footerText: Locator 
    = this.page.locator("(//p[@class = 'footer-text' and contains(text(), 'Need help?')])[3]");

  public readonly cardExpiryErrorMessage: Locator 
    = this.paymentFrame.locator("//p[@id='Field-expiryError' and @class='p-FieldError Error' and @role='alert']");

  public readonly cardCVCErrorMessage: Locator 
    = this.paymentFrame.locator("//p[@id='Field-cvcError' and @class='p-FieldError Error' and @role='alert']");

  public readonly zipCodeErrorMessage: Locator 
    = this.paymentFrame.locator("//p[@id='Field-postalCodeError' and @class='p-FieldError Error' and @role='alert']");

  public readonly progressBar: Locator 
    = this.page.locator("//mat-spinner[@role='progressbar']");

  public readonly readAgreeTerms: Locator 
    = this.page.locator("//div[3]/div[4]/div[1]/div[2]/div/div[6]");

  public readonly termsAgreementTextPop: Locator 
    = this.page.locator("//h1[@id='mat-mdc-dialog-title-0']");

  public readonly nonFrame: Locator 
    = this.page.locator("//app-personal-details//div[3]/div[4]/div[1]/div[2]");

  public readonly step3: Locator 
    = this.page.locator("//app-personal-details/div/div/div[3]/div[4]");

  public readonly stepper1: Locator 
    = this.page.locator("//div[@id='stepper1']/div[1]/div[1]");

  public readonly stepper2: Locator 
    = this.page.locator("//div[@id='stepper1']/div[2]/div[1]");

  public readonly stepper3: Locator 
    = this.page.locator("//div[@id='stepper1']/div[3]/div[1]");

  public readonly stepper1and2Styles: { property: string, value: string } 
    = { property: 'background-color', value: 'rgb(172, 245, 138)' };

  public readonly stepper3Style: { property: string, value: string } 
    = { property: 'background', value: 'rgb(1, 201, 255)' };

  public readonly priceSummary: Locator[] = [
    this.productPriceText,
    this.productPriceAmount,
    this.subtotalText,
    this.subtotalAmount,
    this.totalText,
    this.totalAmount,
    this.processingFeeText,
    this.processingFeeAmount
  ];

  public readonly paymentFormFields: Locator[] = [
    this.cardNumberInput,
    this.expiryDateInput,
    this.cvcInput,
    this.countryDropDown,
    this.zipCodeInput
  ];

  public async enterValidCreditCardDetails(): Promise<void> {
    const cardNumber = UserDataGenerator.getRandomCardNumber();
    const expiryDate = UserDataGenerator.generateFutureExpirationDate();
    const cvc = UserDataGenerator.generateRandomCVC();
    const country = UserDataGenerator.getRandomCountry();
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryDateInput.fill(expiryDate);
    await this.cvcInput.fill(cvc);
    await this.countryDropDown.selectOption(country);
    if (country === "United States") {
        const zipCode = UserDataGenerator.generateRandomZipCode();
        await this.zipCodeInput.fill(zipCode);
    }
  }

  public async enterInvalidCreditCardDetails(): Promise<void> {
    const cardNumber = UserDataGenerator.getInvalidCardNumber();
    await this.cardNumberInput.fill(cardNumber);
  }

  public async enterIncompleteCreditCardDetails(): Promise<void> {
    const cardNumber = UserDataGenerator.getIncompleteCardNumber();
    await this.cardNumberInput.fill(cardNumber);
  }

  public async enterIncompleteCVC(): Promise<void> {
    const cvc = UserDataGenerator.generateIncompleteCVC();
    await this.cvcInput.fill(cvc);
  }

  public async enterExpiredExpirationDateYear(): Promise<void> {
    const expiryDate = UserDataGenerator.generatePastExpirationDate();
    await this.expiryDateInput.fill(expiryDate);
  }

  public async enterIncompleteExpirationDate(): Promise<void> {
    const expiryDate = UserDataGenerator.generateIncompleteExpirationDate();
    await this.expiryDateInput.fill(expiryDate);
  }

  public async enterExpiredExpirationDateMonth(): Promise<void> {
    const expiryDate = UserDataGenerator.generateExpiredDateThisYear();
    await this.expiryDateInput.fill(expiryDate);
  }
}
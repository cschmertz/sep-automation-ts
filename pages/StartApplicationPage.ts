import { BasePage } from "./BasePage";
import { Locator } from 'playwright';
import { generateInvalidUser, generateValidUser } from '../utilities/UserDataGenerator';

export class StartApplicationPage extends BasePage {

  public readonly user = generateValidUser();

  public readonly invalidUser = generateInvalidUser();

  public readonly startApplicationText: Locator 
    = this.page.locator("(//div[@class = 'step-title'])[1]");

  public readonly paymentPlanText: Locator 
    = this.page.locator("(//div[@class = 'step-title'])[2]");

  public readonly reviewText: Locator 
    = this.page.locator("(//div[@class = 'step-title'])[3]");

  public readonly startApplicationStepCircle: Locator 
    = this.page.locator("(//*[@class='step-circle'])[1]");

  public readonly paymentPlanStepCircle: Locator 
    = this.page.locator("(//*[@class='step-circle'])[2]");

  public readonly reviewStepCircle: Locator 
    = this.page.locator("(//*[@class='step-circle'])[3]");

  public readonly firstNameInputBox: Locator 
    = this.page.locator("//input[@formcontrolname='firstName']");

  public readonly lastNameInputBox: Locator 
    = this.page.locator("//input[@formcontrolname='lastName']");

  public readonly emailInputBox: Locator 
    = this.page.locator("//input[@formcontrolname='email']");

  public readonly phoneNumberInputBox: Locator 
    = this.page.locator("//input[@formcontrolname='phoneNumber']");
  
  public readonly phoneNumberText: Locator 
    = this.page.locator("//mat-label[contains(@class, 'ng-tns') and text()='Phone']");

  public readonly howDidYouHearAboutUsDropDown: Locator 
    = this.page.locator("//mat-label[text()='How did you hear about us?']");

  public readonly emailOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Email')]");

  public readonly facebookOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Facebook')]");

  public readonly googleOption: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Google')]");

  public readonly instagramOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Instagram')]");

  public readonly linkedInOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'LinkedIN')]");

  public readonly twitterOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Twitter')]");

  public readonly referredByFriedOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Referred by a friend')]");

  public readonly otherOptionFromDropDown: Locator 
    = this.page.locator("//mat-option/span[contains(text(), 'Other')]");

  public readonly firstNameInputBoxForParents: Locator 
    = this.page.locator("(//input[@formcontrolname='firstName'])[2]");

  public readonly lastNameInputBoxForParents: Locator 
    = this.page.locator("(//input[@formcontrolname='lastName'])[2]");

  public readonly emailInputBoxForParents: Locator 
    = this.page.locator("(//input[@formcontrolname='email'])[2]");

  public readonly phoneNumberInputBoxForParents: Locator 
    = this.page.locator("(//input[@formcontrolname='phoneNumber'])[2]");

  public readonly flexiblePaymentsPlanAvailableText: Locator 
    = this.page.locator("//p[text() = 'Flexible payments plan available']");

  public readonly programStartDate: Locator 
    = this.page.locator("//div[contains(text(), 'Program Start Date')]/b[@class='info-value']");

  public readonly refundEndDate: Locator 
    = this.page.locator("(//b[@class='info-value'])[2]");

  public readonly refundPolicyInfo: Locator 
    = this.page.locator("//app-personal-details//form//div[1]//div[5]");

  public readonly programNameOnInfoCard: Locator 
    = this.page.locator("//p[@class='program-title primary-color']");

  public readonly programPrice: Locator 
    = this.page.locator("//div[@class='col-sm']/b[@class = 'info-primary']");

  public readonly footer: Locator 
    = this.page.locator("//p[@class = 'footer-text' and contains(text(), 'Need help?')]");

  public readonly nextButton: Locator 
    = this.page.locator("//button[@class = 'next-button'][contains(text(), 'Next')]");

  public readonly programBasePrice: Locator 
    = this.page.locator("//span[@class='ng-star-inserted']/s");

  public readonly enterPersonalDetails: Locator 
    = this.page.locator("//b[contains(.,'Enter personal details')]");

  public readonly discountedPrice: Locator 
    = this.page.locator("//b[@class='info-primary']");

  public readonly originalPrice: Locator 
    = this.page.locator("//s[contains(.,'$')]");
  
  public readonly stepper1: Locator 
    = this.page.locator('#stepper1 > div:first-child > div:first-child');

  public readonly stepper2: Locator 
    = this.page.locator('#stepper1 > div:nth-child(2) > div:first-child');

  public readonly stepper3: Locator 
    = this.page.locator('#stepper1 > div:nth-child(3) > div:first-child');

  public readonly stepCircles: Locator[] = [
    this.startApplicationStepCircle,
    this.paymentPlanStepCircle,
    this.reviewStepCircle
  ];

  public readonly stepTitles: Locator[] = [
    this.startApplicationText,
    this.paymentPlanText,
    this.reviewText
  ];

  public readonly requiredFields: Locator[] = [
    this.firstNameInputBox,
    this.lastNameInputBox,
    this.emailInputBox,
    this.phoneNumberInputBox
  ];

  public readonly fieldMap: Record<string, Locator> = {
    'First Name': this.firstNameInputBox,
    'Last Name': this.lastNameInputBox,
    'Email Address': this.emailInputBox,
    'Phone': this.phoneNumberInputBox
  };

  public readonly stepper1Styles 
    = { property: 'background-color', value: 'rgb(1, 201, 255)' };

  public readonly stepper2and3Styles 
    = { property: 'color', value: 'rgb(217, 226, 236)' };

  async selectHearAboutUsOption(optionName: string): Promise<void> {
    await this.howDidYouHearAboutUsDropDown.click();

    switch (optionName.toLowerCase()) {
      case 'email':
        await this.emailOptionFromDropDown.click();
        break;
      case 'facebook':
        await this.facebookOptionFromDropDown.click();
        break;
      case 'google':
        await this.googleOption.click();
        break;
      case 'instagram':
        await this.instagramOptionFromDropDown.click();
        break;
      case 'linkedin':
        await this.linkedInOptionFromDropDown.click();
        break;
      case 'twitter':
        await this.twitterOptionFromDropDown.click();
        break;
      case 'referred by a friend or colleague': 
        await this.referredByFriedOptionFromDropDown.click();
        break;
      case 'other':
        await this.otherOptionFromDropDown.click();
        break;
      default:
        throw new Error(`Option ${optionName} not found`);
    }
  }

  async actualCheckoutSteps(): Promise<{ 'Step Number': string, 'Step Name': string }[]> {
    const steps: { 'Step Number': string, 'Step Name': string }[] = [];
    for (let i = 0; i < this.stepCircles.length; i++) {
      const stepNameText = await this.stepTitles[i].textContent();
      steps.push({
        'Step Number': (i + 1).toString(),
        'Step Name': stepNameText?.trim() || ''
      });
    }
    return steps;
  }

  async fillAndPressEnter(field: Locator, text: string): Promise<void> {
    await field.fill(text);
    await field.press('Enter');
  }

  async getDropdownOptions(): Promise<Locator[]> {
    return [
      this.emailOptionFromDropDown,
      this.facebookOptionFromDropDown,
      this.googleOption,
      this.instagramOptionFromDropDown,
      this.linkedInOptionFromDropDown,
      this.twitterOptionFromDropDown,
      this.referredByFriedOptionFromDropDown,
      this.otherOptionFromDropDown
    ];
  }

  async invalidActions(fieldName: string, condition: string): Promise<void> {
    const field = this.fieldMap[fieldName]; 
    if (!field) {
      throw new Error(`Field "${fieldName}" not found in the field map`);
    }
    if (condition === 'blank') {
      await field.fill('');
    } else if (condition === 'with invalid format' && fieldName === 'Email Address') {
      await field.fill(this.invalidUser.invalidEmailMissingAt);
    } else if (condition === 'with non-numeric characters' && fieldName === 'Phone') {
      await field.fill(this.invalidUser.randomString);
    } else {
      throw new Error(`Condition "${condition}" not implemented for field "${fieldName}"`);
    }
  }

  async validUser(): Promise<void> {
    await this.firstNameInputBox.fill(this.user.firstName);
    await this.lastNameInputBox.fill(this.user.lastName);
    await this.emailInputBox.fill(this.user.email);
    await this.phoneNumberInputBox.fill(this.user.phoneNumber);
    await this.nextButton.click();
  }

}

import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { startApplicationPage, paymentPlanPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";


When('user enters a valid first name', async function (): Promise<void> {
  await startApplicationPage.firstNameInputBox.fill(startApplicationPage.user.firstName);
  await expect(startApplicationPage.firstNameInputBox).toHaveValue(startApplicationPage.user.firstName);
});

When('user enters a valid last name', async function (): Promise<void> {
  await startApplicationPage.lastNameInputBox.fill(startApplicationPage.user.lastName);
  await expect(startApplicationPage.lastNameInputBox).toHaveValue(startApplicationPage.user.lastName);
});

When('user enters a valid email address', async function (): Promise<void> {
  await startApplicationPage.emailInputBox.fill(startApplicationPage.user.email);
  await expect(startApplicationPage.emailInputBox).toHaveValue(startApplicationPage.user.email);
});

When('user enters a valid phone number', async function (): Promise<void> {
  await startApplicationPage.phoneNumberInputBox.fill(startApplicationPage.user.phoneNumber);
  await expect(startApplicationPage.phoneNumberInputBox).toHaveValue(startApplicationPage.user.phoneNumber);
});

When('user selects an option for {string}', async function (option: string): Promise<void> {
  await startApplicationPage.selectHearAboutUsOption(startApplicationPage.user.heardAboutUs);
});

When('user clicks on the {string} button', async function (button: string): Promise<void> {
  await startApplicationPage.nextButton.click();
});

Then('user should be taken to step {int}', async function (step: number): Promise<void>{
  await expect(paymentPlanPage.chooseAPaymentPlanText).toBeVisible();
});
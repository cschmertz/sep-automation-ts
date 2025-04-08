import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { reviewPaymentPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

When('user enters an incomplete CVC number', async function (): Promise<void> {
  await reviewPaymentPage.enterIncompleteCVC();
});

When('user clicks outside the CVC number field', async function (): Promise<void> {
  await reviewPaymentPage.expiryDateInput.click();
});

Then('user should see the CVC error message {string}', 
async function (expectedMessage: string): Promise<void> {
  await expect(reviewPaymentPage.cardCVCErrorMessage).toBeVisible();
  const actualErrorMessage = await reviewPaymentPage.cardCVCErrorMessage.innerText();
  expect(actualErrorMessage).toBe(expectedMessage);
});
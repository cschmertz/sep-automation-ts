import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { reviewPaymentPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

When('user enters an invalid card number', async function (): Promise<void> {
  await reviewPaymentPage.enterInvalidCreditCardDetails();
});

When('user enters an incomplete card number', async function (): Promise<void> {
  await reviewPaymentPage.enterIncompleteCreditCardDetails();
});

When('user clicks outside the card number field', async function (): Promise<void> {
  await reviewPaymentPage.expiryDateInput.click();
});

Then('user should see the credit card field error message {string}', 
async function (expectedMessage: string): Promise<void> {
  await expect(reviewPaymentPage.cardNumberErrorMessage).toBeVisible();
  const actualErrorMessage = await reviewPaymentPage.cardNumberErrorMessage.innerText();
  expect(actualErrorMessage).toBe(expectedMessage);
});
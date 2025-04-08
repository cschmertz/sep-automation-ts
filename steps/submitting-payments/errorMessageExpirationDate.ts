import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { reviewPaymentPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

When('user enters an expired expiration date of a previous year', 
async function (): Promise<void> {
    await reviewPaymentPage.enterExpiredExpirationDateYear();
});

When('user enters an expired expiration date of a previous month in the current year', 
async function (): Promise<void> {
    await reviewPaymentPage.enterExpiredExpirationDateMonth();
});

When('user enters an incomplete expiration date', 
async function (): Promise<void> {
    await reviewPaymentPage.enterIncompleteExpirationDate();
});

When('user clicks outside the expiration date field', 
async function (): Promise<void> {
    await reviewPaymentPage.cvcInput.click();
});

Then('user should see the expiration date error message {string}', 
async function (expectedMessage: string): Promise<void> {
    await expect(reviewPaymentPage.cardExpiryErrorMessage).toBeVisible();  
    const actualErrorMessage = await reviewPaymentPage.cardExpiryErrorMessage.innerText();
    expect(actualErrorMessage).toBe(expectedMessage);
});
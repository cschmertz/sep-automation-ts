import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { reviewPaymentPage, paymentPlanPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";
import { BrowserUtility } from "../../utilities/Browserutility";

Given('user has completed step two with a valid option', async function (): Promise<void> {
    await paymentPlanPage.selectRandomPaymentOption();
});

Given('user is on step three of the enrollment process', async function (): Promise<void> {
    const paymentSummary = reviewPaymentPage.paymentFormFields;
    const priceSummary = reviewPaymentPage.priceSummary;
    for (const each of priceSummary) {
        await expect(each).toBeVisible();
    }   
    for (const each of paymentSummary) {
        await expect(each).toBeVisible();
    }
});

When('user enters valid card information', async function (): Promise<void> {
    await reviewPaymentPage.enterValidCreditCardDetails();
    await BrowserUtility.wait(3000);
});

When('user checks the terms and conditions checkbox', async function (): Promise<void> {
    await BrowserUtility.check(reviewPaymentPage.termsAndConditionsCheckbox);
    await BrowserUtility.wait(3000);
});

When('user clicks on the Pay button', async function (): Promise<void> {
    await reviewPaymentPage.payButton.click();
    await BrowserUtility.wait(10000);
});

// Pending steps below (kept for completeness)
Then('user is redirected to the confirmation page', async function (): Promise<void> {
    // await expect(paymentConfirmationPage.paymentConfirmationText).toBeVisible();
});

Then('steps {int}, {int}, and {int} in the stepper are green', async function (step1: number, step2: number, step3: number): Promise<string> {
    return 'pending';
});

Then('the correct program name is displayed', async function (): Promise<string> {
    return 'pending';
});

Then('the correct user email is displayed', async function (): Promise<string> {
    return 'pending';
});

Then('the correct company contact information is displayed', async function (): Promise<string> {
    return 'pending';
});
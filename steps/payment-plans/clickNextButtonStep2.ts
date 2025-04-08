import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { paymentPlanPage, reviewPaymentPage, startApplicationPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";


Given('user has completed step one with valid information', async function (): Promise<void> {
    await startApplicationPage.validUser();
});

Given('user is on step two of the enrollment process', async function (): Promise<void> {
    const actualHeader = await paymentPlanPage.chooseAPaymentPlanText.innerText();
    const expectedHeader = "Choose a payment plan";
    await expect(paymentPlanPage.chooseAPaymentPlanText).toBeVisible();
    expect(actualHeader).toEqual(expectedHeader);
});

When('user selects the {string} payment plan', async function (paymentPlan: string): Promise<void> {
    this.lastSelectedPlan = paymentPlan;
    switch (paymentPlan) {
        case 'Upfront':
            await paymentPlanPage.upfrontPaymentOption.click();
            break;
        case '5 Installments':
            await paymentPlanPage.installmentsPaymentOption.click();
            break;
        default:
            throw new Error(`Payment plan "${paymentPlan}" is not recognized.`);
    }
});

When('user clicks on the next button', async function (): Promise<void> {
    await paymentPlanPage.activeNextButton.click();
});

Then('the next button should be enabled', async function (): Promise<void> {
    await expect(paymentPlanPage.activeNextButton).toBeEnabled();
});

Then('the Step 3 page should be displayed', async function (): Promise<void> {
    await expect(reviewPaymentPage.step3).toBeVisible();
});

Then('the payment component should be displayed', async function (): Promise<void> {
    await expect(reviewPaymentPage.paymentForm).toBeVisible();
});

Then('a price summary should be displayed', async function (): Promise<void> {
    const priceSummary = await reviewPaymentPage.priceSummary;
    for (const each of priceSummary) {
        await expect(each).toBeVisible();
    }
});

Then('the back button should be displayed', async function (): Promise<void> {
    await expect(reviewPaymentPage.backButton).toBeVisible();
});

Then('the pay button should be displayed by default', async function (): Promise<void> {
    await expect(reviewPaymentPage.payButton).toBeVisible();
});

Then('the stepper should show steps 1 and 2 as green', async function (): Promise<void> {
    const stepper1 = reviewPaymentPage.stepper1;
    const stepper2 = reviewPaymentPage.stepper2;
    await expect(stepper1).toHaveCSS(
        reviewPaymentPage.stepper1and2Styles.property, 
        reviewPaymentPage.stepper1and2Styles.value
    );
    await expect(stepper2).toHaveCSS(
        reviewPaymentPage.stepper1and2Styles.property, 
        reviewPaymentPage.stepper1and2Styles.value
    );
});

Then('step 3 should be blue', async function (): Promise<void> {
    const stepper3 = reviewPaymentPage.stepper3;
    const backgroundColor = await stepper3.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
    });
    expect(backgroundColor).toBe('rgb(1, 201, 255)');
});
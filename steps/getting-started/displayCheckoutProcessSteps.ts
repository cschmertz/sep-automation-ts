import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { startApplicationPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

Then('the system should display the steps of the checkout process as:', async function (dataTable) {
    const expectedSteps: Array<Record<string, string>> = dataTable.hashes();
    const actualSteps: Array<Record<string, string>> = await startApplicationPage.actualCheckoutSteps();
    expect(actualSteps).toEqual(expectedSteps);
});

Then('the system should highlight {string} in blue', async function (string): Promise<void> {
    const stepper1 = startApplicationPage.stepper1;
    await expect(stepper1).toHaveCSS(startApplicationPage.stepper1Styles.property, startApplicationPage.stepper1Styles.value);
});

Then('the system should display {string} and {string} in grey', async function (string, string2): Promise<void> {
    const stepper2 = startApplicationPage.stepper2;
    const stepper3 = startApplicationPage.stepper3;
    await expect(stepper2).toHaveCSS(startApplicationPage.stepper2and3Styles.property, startApplicationPage.stepper2and3Styles.value);
    await expect(stepper3).toHaveCSS(startApplicationPage.stepper2and3Styles.property, startApplicationPage.stepper2and3Styles.value);
});

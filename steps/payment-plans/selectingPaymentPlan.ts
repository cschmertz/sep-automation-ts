import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { paymentPlanPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

Then('the selected plan should be highlighted', async function (this: any): Promise<void> {
    const selectedOption = await paymentPlanPage.getSelectedPaymentOptionBorder(this.lastSelectedPlan);
    await expect(selectedOption).toHaveCSS('border', paymentPlanPage.highlightBorder);
});

Then('the {string} button should be active', async function (buttonName: string): Promise<void> {
    await expect(paymentPlanPage.activeNextButton).toBeVisible();
    await expect(paymentPlanPage.activeNextButton).toBeEnabled();
});

When('user changes payment plan selection', async function (this: any): Promise<void> {
    await paymentPlanPage.clickNewPaymentOption(this.lastSelectedPlan);
});

Then('the newly selected payment plan should be highlighted', async function (this: any): Promise<void> {
    this.newSelection = this.lastSelectedPlan === 'Upfront' ? '5 Installments' : 'Upfront';
    const newSelectionElement = await paymentPlanPage.getSelectedPaymentOptionBorder(this.newSelection);
    await expect(newSelectionElement).toHaveCSS('border', paymentPlanPage.highlightBorder);
});

Then('the previous selection should no longer be highlighted', async function (this: any): Promise<void> {
    const previousSelectionElement = await paymentPlanPage.getSelectedPaymentOptionBorder(this.lastSelectedPlan);
    await expect(previousSelectionElement).not.toHaveCSS('border', paymentPlanPage.highlightBorder);
});
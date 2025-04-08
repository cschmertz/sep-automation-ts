import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { startApplicationPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

Then('the {string} text field should be present and required', async function (fieldName: string): Promise<void> {
    for (const field of startApplicationPage.requiredFields) {
        await expect(field).toBeVisible();
        const IS_REQUIRED = await field.getAttribute('required');
        expect(IS_REQUIRED).not.toBeNull();
  }
});

Then('the {string} dropdown should be present', async function (dropdownName: string): Promise<void> {
    await expect(startApplicationPage.howDidYouHearAboutUsDropDown).toBeVisible();
    await startApplicationPage.howDidYouHearAboutUsDropDown.click();
    const dropdown = await startApplicationPage.getDropdownOptions();
    for(const field of dropdown){
        await expect(field).toBeVisible();
        await expect(field).toBeEnabled();
    }
});

Then('the {string} text field should reject non-numeric characters', async function (fieldName: string): Promise<void> {
    await startApplicationPage.fillAndPressEnter(startApplicationPage.phoneNumberInputBox, startApplicationPage.invalidUser.randomString);
    await expect(startApplicationPage.phoneNumberText).toHaveCSS('color', 'rgb(255, 0, 0)');
});

When('user leaves First Name blank', async function (): Promise<void> {
    await startApplicationPage.invalidActions('First Name', 'blank');
});

When('user leaves Last Name blank', async function (): Promise<void> {
    await startApplicationPage.invalidActions('Last Name', 'blank');
});

When('user leaves Email Address blank', async function (): Promise<void> {
    await startApplicationPage.invalidActions('Email Address', 'blank');
});

When('user leaves Email Address with invalid format', async function (): Promise<void> {
    await startApplicationPage.invalidActions('Email Address', 'with invalid format');
});

When('user leaves Phone with non-numeric characters', async function (): Promise<void> {
    await startApplicationPage.invalidActions('Phone', 'with non-numeric characters');
});

Then('the {string} button should be disabled', async function (buttonName: string): Promise<void> {
    await startApplicationPage.nextButton.click();
    await expect(startApplicationPage.programNameOnInfoCard).toBeVisible();
});
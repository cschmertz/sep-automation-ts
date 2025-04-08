import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { startApplicationPage, leftMainPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

Then('the header should show the Cydeo logo and display {string}', async function (expectedText: string): Promise<void> {
    await expect(leftMainPage.cydeoImageAtLeftWindow).toBeVisible();
    const text: string = await leftMainPage.secureCheckout.innerText();
    expect(text.trim()).toEqual(expectedText);
});

Then('the program name should be visible in the product card', async function (): Promise<void> {
    await expect(leftMainPage.programName).toBeVisible();
    const text: string = await leftMainPage.programName.innerText();
    expect(text).toEqual(productInfo.productName);
});

Then('the right footer should display {string}', async function (expectedText: string): Promise<void> {
    const footerText: string = await startApplicationPage.footer.first().innerText();
    expect(footerText).toEqual(expectedText);
});

Then('the Cydeo logo should be visible in the footer', async function (): Promise<void> {
    await expect(leftMainPage.cydeoImageAtLeftWindowFooter).toBeVisible();
});

Then('the left footer should contain elements in exact order:', async function (dataTable: any): Promise<void> {
    const expectedElements: Array<Record<string, string>> = dataTable.hashes();
    const footerElements = await leftMainPage.footerElements.all();
    expect(footerElements.length).toEqual(expectedElements.length - 1);
    await expect(leftMainPage.cydeoImageAtLeftWindowFooter).toBeVisible();
    for (let i = 1; i < expectedElements.length; i++) {
        const linkText: string = await footerElements[i-1].innerText();
        expect(linkText.trim()).toEqual(expectedElements[i].Text);
    }
});

When('viewing the page on a {string} screen', async function (deviceType: string): Promise<void> {
    if (deviceType === 'desktop') {
        await page.setViewportSize({ width: 1920, height: 1080 });
    } else if (deviceType === 'mobile') {
        await page.setViewportSize({ width: 390, height: 844 });
    } else {
        throw new Error(`Unknown device type: ${deviceType}`);
    }
});

Then('all key elements should remain visible and properly aligned', async function (): Promise<void> {
    for (const field of startApplicationPage.requiredFields) {
        await expect(field).toBeVisible();
    }
    for (const title of startApplicationPage.stepTitles) {
        await expect(title).toBeVisible();
    }
});
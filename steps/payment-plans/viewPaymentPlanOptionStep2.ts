import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { paymentPlanPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

Then('there should be one upfront price', async function (): Promise<void> {
    const actualPrice: string = await paymentPlanPage.upfrontPaymentAmount.innerText();
    const expectedPrice: string = productInfo.prices[0].discountedAmount.toString();
    expect(actualPrice).toContain(expectedPrice);
});

Then('the upfront payment section text should display:', async function (dataTable: any): Promise<void> {
    const data: string[][] = dataTable.raw();
    const expectedText: string = data[0][0];
    let expectedPrice: string = data[1][0];
    expectedPrice = expectedPrice.replace('<upfront_price>', productInfo.prices[0].discountedAmount.toString());
    const actualText: string = await paymentPlanPage.upfrontPaymentOption.innerText();
    const actualPrice: string = await paymentPlanPage.upfrontPaymentAmount.innerText();
    await expect(paymentPlanPage.upfrontPaymentOption).toBeVisible();
    await expect(paymentPlanPage.upfrontPaymentAmount).toBeVisible();
    expect(actualText).toEqual(expectedText);
    expect(expectedPrice).toContain(actualPrice);
});

Then('there should be {int} installments', async function (expectedCount: number): Promise<void> {
    const actualText: string = await paymentPlanPage.installmentsPaymentOption.innerText();
    const numberOfInstallments: number | null = productInfo.prices[1].numberOfInstallments;
    const expectedText: string = `${numberOfInstallments} Installments`;   
    await expect(paymentPlanPage.installmentsPaymentOption).toBeVisible();
    expect(actualText).toEqual(expectedText);
    expect(numberOfInstallments).toEqual(expectedCount);
});

Then('the installment payment section text should display:', async function (dataTable: any): Promise<void> {
    const data: string[][] = dataTable.raw();
    const expectedText: string = data[0][0];
    let expectedPrice: string = data[1][0];
    const monthly_price: number = productInfo.prices[1].baseAmount / (productInfo.prices[1].numberOfInstallments || 1);
    expectedPrice = expectedPrice.replace('<monthly_price>', monthly_price.toString());
    const actualText: string = await paymentPlanPage.installmentsPaymentOption.innerText();
    const actualPrice: string = await paymentPlanPage.installmentsPaymentAmount.innerText(); 
    await expect(paymentPlanPage.installmentsPaymentOption).toBeVisible();
    await expect(paymentPlanPage.installmentsPaymentAmount).toBeVisible();
    expect(actualText).toEqual(expectedText);
    expect(expectedPrice).toEqual(actualPrice);
});

Then('the payment plan elements should appear in order:', async function (dataTable: any): Promise<void> {
    const expectedTexts: string[] = dataTable.raw().map((row: string[]) => row[0]);
    const section = paymentPlanPage.expectedTexts;    
    for (let i = 0; i < section.length - 1; i++) {
        await expect(section[i]).toBeVisible();
        const text: string = await section[i].innerText();
        expect(text).toEqual(expectedTexts[i]);
    }  
    for (let i = 0; i < section.length - 1; i++) {
        const currentBox = await section[i].boundingBox();
        const nextBox = await section[i + 1].boundingBox();
        if (currentBox && nextBox) {
            expect(currentBox.y).toBeLessThan(nextBox.y);
        }
    }
});
import { Given, Then, When } from "@cucumber/cucumber";
import { expect} from "@playwright/test";
import { startApplicationPage, leftMainPage, page } from "../../globalPagesSetup";
import { productInfo } from "../../utilities/qa-data-reader";

Then('the product name {string} should be displayed on the information card', async function (productName: string): Promise<void> {
  const expectedProductName = productInfo.productName;
  const actualProductName = await startApplicationPage.programNameOnInfoCard.innerText();
  await expect(startApplicationPage.programNameOnInfoCard).toBeVisible();
  expect(expectedProductName).toEqual(actualProductName);
});

Then('the product name on the information card should match {string} on the left side', async function (productName: string): Promise<void> {
  const expectedProductName = productInfo.productName;
  const actualProductName = await leftMainPage.programName.innerText();
  await expect(leftMainPage.programName).toBeVisible();
  expect(expectedProductName).toEqual(actualProductName);
});

Then('the product price {string} should be displayed', async function (price: string): Promise<void> {
  const expectedProductPrice = String((productInfo.prices[0].baseAmount) - (productInfo.prices[0].upfrontDiscountAmount));
  const actualProductPrice = await startApplicationPage.discountedPrice.innerText();
  const normalizedActualPrice = actualProductPrice.replace(/[^0-9]/g, '');
  await expect(startApplicationPage.discountedPrice).toBeVisible();
  await expect(expectedProductPrice).toEqual(normalizedActualPrice);
});

Then('the text {string} should be visible', async function (text: string): Promise<void> {
  await expect(startApplicationPage.flexiblePaymentsPlanAvailableText).toBeVisible();
});

Then('the program start date {string} should be displayed', async function (date: string): Promise<void> {
  const actualStartDate = await startApplicationPage.programStartDate.innerText();
  const expectedStartDate = productInfo.startDate;
  await expect(startApplicationPage.programStartDate).toBeVisible();
  expect(expectedStartDate).toEqual(actualStartDate);
});

Then('the refund policy text {string} should be visible', async function (policyText: string): Promise<void> {
  const actualRefundPolicy = await startApplicationPage.refundPolicyInfo.innerText();
  const expectedRefundDate = productInfo.refundDate;
  await expect(startApplicationPage.refundPolicyInfo).toBeVisible();
  expect(actualRefundPolicy).toContain(expectedRefundDate);
});

Then('the final refund date {string} should be displayed', async function (date: string): Promise<void> {
  const actualFinalRefundDate = await startApplicationPage.refundEndDate.innerText();
  const expectedRefundDate = productInfo.refundDate;
  await expect(startApplicationPage.refundEndDate).toBeVisible();
  expect(expectedRefundDate).toEqual(actualFinalRefundDate);
});
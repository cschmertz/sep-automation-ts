import { Page } from 'playwright';
import { LeftMainPage } from "./pages/LeftMainPage";
import { PaymentPlanPage } from "./pages/PaymentPlanPage";
import { StartApplicationPage } from "./pages/StartApplicationPage";
import { ReviewPaymentPage } from "./pages/ReviewPaymentPage";
// Import OTHER PAGES CLASSES HERE...


/**
 * Global page object declarations
 * These are exported to be accessible throughout the test suite
 */
export let leftMainPage: LeftMainPage;
export let paymentPlanPage: PaymentPlanPage;
export let startApplicationPage: StartApplicationPage;
export let reviewPaymentPage: ReviewPaymentPage;
export let page: Page;
// ADD OTHER PAGE CLASS REFERENCES HERE...


/**
 * Initializes all page objects with the provided Playwright Page instance
 * @param argPage - The Playwright Page object to be used for all page instances
 */
export const initElements = (argPage: Page): void => {
    // Set the global page object
    page = argPage;

    // Initialize page objects
    leftMainPage = new LeftMainPage(page);
    paymentPlanPage = new PaymentPlanPage(page);
    startApplicationPage = new StartApplicationPage(page);
    reviewPaymentPage = new ReviewPaymentPage(page);
    // INITIALIZE OTHER PAGE INSTANCES HERE...

    
}
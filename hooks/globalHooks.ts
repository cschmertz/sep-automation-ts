import { Before, After, setWorldConstructor, setDefaultTimeout, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium, firefox, Page, webkit } from "@playwright/test";
import { initElements } from "../globalPagesSetup";
import fs from "fs";
import path from "path";

/**
 * Configuration constants
 */
const BROWSER_TYPE: string = "chrome";
const HEADLESS_MODE: boolean = false;
const MAXIMIZED_WINDOW: boolean = true;
const SLOW_MOTION_DELAY: number = 0; // slow mode in milliseconds
const DEFAULT_TIMEOUT: number = 30000; // default timeout in milliseconds

/**
 * Before hook: Initializes the test environment before each scenario
 */
Before(async function (this: CustomWorld) {
  await this.init();
});

/**
 * After hook: Cleans up the test environment after each scenario
 * Takes a screenshot if the scenario failed
 */
After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await takeScreenshot(this.page, scenario.pickle.name);
  }
  await this.close();
});

/**
 * Takes a screenshot of the current page
 * @param page - The Playwright Page object
 * @param scenarioName - The name of the scenario
 */
async function takeScreenshot(page: Page | undefined, scenarioName: string): Promise<void> {
  if (!page) {
    console.warn("Page object not available, skipping screenshot");
    return;
  }

  const screenshotsDir: string = path.join(process.cwd(), "reports", "screenshots");
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const currentDateTime: string = new Date().toISOString().replace(/[:T.]/g, "_").slice(0, -5);
  const fileName: string = `${scenarioName.replace(/\s+/g, "_")}_${currentDateTime}.png`;
  const filePath: string = path.join(screenshotsDir, fileName);

  await page.screenshot({ path: filePath, fullPage: true });
}

/**
 * CustomWorld class: Represents the test world for each scenario
 */
class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  /**
   * Initializes the browser based on the configured browser type
   */
  async initializeBrowser(): Promise<Browser> {
    const launchOptions = {
      headless: HEADLESS_MODE,
      slowMo: SLOW_MOTION_DELAY,
      args: MAXIMIZED_WINDOW && BROWSER_TYPE.toLowerCase() === "chrome" ? ["--start-maximized"] : [],
    };

    const browserType: string = BROWSER_TYPE.toLowerCase();
    return await (browserType === "firefox" ? firefox : browserType === "webkit" || browserType === "safari" ? webkit : chromium).launch(launchOptions);
  }

  /**
   * Initializes the test environment
   */
  async init(): Promise<void> {
    this.browser = await this.initializeBrowser();
    this.context = await this.browser.newContext(MAXIMIZED_WINDOW ? { viewport: null } : {});
    this.page = await this.context.newPage();

    if (MAXIMIZED_WINDOW) {
      await this.page.setViewportSize(await this.page.evaluate(() => ({
        width: window.screen.availWidth,
        height: window.screen.availHeight,
      })));
    }

    initElements(this.page);
  }

  /**
   * Closes the browser and page
   */
  async close(): Promise<void> {
    await Promise.all([
      this.page?.close().catch(err => console.warn('Error closing page:', err)),
      this.browser?.close().catch(err => console.warn('Error closing browser:', err))
    ]);
  }
}

// Set the custom world constructor
setWorldConstructor(CustomWorld);

// Set the default timeout for steps
setDefaultTimeout(DEFAULT_TIMEOUT);
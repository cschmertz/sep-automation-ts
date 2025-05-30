import {
  Before,
  After,
  setWorldConstructor,
  setDefaultTimeout,
  Status,
} from "@cucumber/cucumber";
import {
  Browser,
  BrowserContext,
  chromium,
  firefox,
  Page,
  webkit,
} from "@playwright/test";
import { initElements } from "../globalPagesSetup";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { getStripeCredentials } from "../utilities/jsonUtils";
import { ApiClient } from "../utilities/apiClient";
import { apiConfig } from "../configs/apiConfig";
import type { Booking } from "../models/booking";
import { prisma, dbFactories } from "../utilities/prismaTypes";
import { resetDatabase, testData } from "../utilities/dbUtils";

dotenv.config();

/**
 * Configuration constants
 */
const BROWSER_TYPE: string = "chrome";
const HEADLESS_MODE: boolean = false;
const MAXIMIZED_WINDOW: boolean = true;
const SLOW_MOTION_DELAY: number = 0;
const DEFAULT_TIMEOUT: number = 30000;

// Global DB connection flag
let isDbConnected = false;

/**
 * Before hook: Connects to DB and initializes environment
 */
Before(async function (this: CustomWorld) {
  if (!isDbConnected) {
    try {
      await prisma.$connect();
      console.log("Database connected successfully");
      isDbConnected = true;
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }

  await this.init();
});

/**
 * After hook: Cleans up browser and captures screenshot if scenario failed
 */
After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await takeScreenshot(this.page, scenario.pickle.name);
  }
  await this.close();
});

/**
 * Tag-specific hook for database reset
 */
Before({ tags: "@db" }, async function () {
  await resetDatabase();
  console.log("Database reset complete");
});

/**
 * Global teardown for database connection
 */
process.on("beforeExit", async () => {
  if (isDbConnected) {
    try {
      await prisma.$disconnect();
      console.log("Database disconnected successfully");
    } catch (e) {
      console.warn("Error disconnecting Prisma client:", e);
    }
  }
});

/**
 * Screenshot utility
 */
async function takeScreenshot(
  page: Page | undefined,
  scenarioName: string
): Promise<void> {
  if (!page) {
    console.warn("Page object not available, skipping screenshot");
    return;
  }

  const screenshotsDir: string = path.join(
    process.cwd(),
    "reports",
    "screenshots"
  );
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const currentDateTime: string = new Date()
    .toISOString()
    .replace(/[:T.]/g, "_")
    .slice(0, -5);
  const fileName: string = `${scenarioName.replace(/\s+/g, "_")}_${currentDateTime}.png`;
  const filePath: string = path.join(screenshotsDir, fileName);

  await page.screenshot({ path: filePath, fullPage: true });
}

/**
 * CustomWorld class: Represents the test world for each scenario
 */
export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  apiClient!: ApiClient;
  apiResponse: any = null;
  apiResponseStatus: number = 0;
  lastBookingId: number = 0;
  bookingPayload!: Booking;

  cardNumbers: string[] = [];
  countries: string[] = [];

  // DB utilities and tracking
  db = prisma;
  dbUtils = {
    resetDatabase,
    testData,
    dbFactories,
  };
  testData: {
    company?: any;
    driver?: any;
    vehicle?: any;
    department?: any;
    [key: string]: any;
  } = {};

  /**
   * Initializes the browser based on the configured browser type
   */
  async initializeBrowser(): Promise<Browser> {
    const launchOptions = {
      headless: HEADLESS_MODE,
      slowMo: SLOW_MOTION_DELAY,
      args:
        MAXIMIZED_WINDOW && BROWSER_TYPE.toLowerCase() === "chrome"
          ? ["--start-maximized"]
          : [],
    };

    const browserType: string = BROWSER_TYPE.toLowerCase();
    return await (browserType === "firefox"
      ? firefox
      : browserType === "webkit" || browserType === "safari"
      ? webkit
      : chromium
    ).launch(launchOptions);
  }

  /**
   * Initializes test environment
   */
  async init(): Promise<void> {
    this.apiClient = new ApiClient(apiConfig.baseUrl, {
      timeout: apiConfig.timeout,
    });

    if (process.env.TEST_TYPE !== "api") {
      this.browser = await this.initializeBrowser();
      this.context = await this.browser.newContext(
        MAXIMIZED_WINDOW ? { viewport: null } : {}
      );
      this.page = await this.context.newPage();

      if (MAXIMIZED_WINDOW) {
        await this.page.setViewportSize(
          await this.page.evaluate(() => ({
            width: window.screen.availWidth,
            height: window.screen.availHeight,
          }))
        );
      }

      const jsonPath = process.env.STRIPE_CREDENTIALS;
      if (!jsonPath)
        throw new Error("STRIPE_CREDENTIALS path not set in .env");

      const { card_numbers, countries } = getStripeCredentials(jsonPath);
      this.cardNumbers = card_numbers.map((n) => n.toString());
      this.countries = countries;

      initElements(this.page);
    }
  }

  /**
   * Closes browser and cleans up
   */
  async close(): Promise<void> {
    if (this.page || this.browser) {
      await Promise.all([
        this.page?.close().catch((err) =>
          console.warn("Error closing page:", err)
        ),
        this.browser?.close().catch((err) =>
          console.warn("Error closing browser:", err)
        ),
      ]);
    }
  }

  /**
   * Authenticates via API and sets token
   */
  async authenticateApi(): Promise<string> {
    const response = await this.apiClient.post("/auth", {
      username: apiConfig.auth.username,
      password: apiConfig.auth.password,
    });

    if (response.status !== 200) {
      throw new Error(`Authentication failed with status ${response.status}`);
    }

    const token = response.data.token;
    this.apiClient.setAuthToken(token);
    return token;
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(DEFAULT_TIMEOUT);

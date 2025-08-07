import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from '../../hooks/globalHooks';
import { Booking, BookingWithId } from '../../models/booking';
import { expect } from '@playwright/test';

// Authentication steps
Given('I am authenticated with the booking API', async function(this: CustomWorld) {
  await this.authenticateApi();
});

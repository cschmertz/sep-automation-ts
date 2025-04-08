import { Given } from '@cucumber/cucumber';
import { expect} from "@playwright/test";
import { stripe } from '../../utilities/stripeClient';


Given('I have a valid Stripe API test key', () => {
  expect(process.env.STRIPE_SECRET_KEY).toBeTruthy();
});

Given('I have initialized the Stripe client', () => {
  expect(stripe).toBeTruthy();
});
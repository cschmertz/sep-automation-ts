import { Given, When, Then, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import Stripe from 'stripe';
import { stripe, StripeTestContext } from '../../utilities/stripeClient';

interface CustomerTestContext {
  customer?: Stripe.Customer;
  paymentMethod?: Stripe.PaymentMethod;
}

const context: CustomerTestContext = {};

Given('I create a new customer with:', async (dataTable: any) => {
  const { email, name } = dataTable.hashes()[0];
  context.customer = await stripe.customers.create({
    email,
    name,
    metadata: { test_case: 'customer_creation' }
  });
  expect(context.customer.id).toMatch(/^cus_/);
  expect(context.customer.email).toBe(email);
  expect(context.customer.name).toBe(name);
});

When('I attach a payment method {string} to the customer', async (pmId: string) => {
  if (!context.customer) throw new Error('Customer not initialized');
  context.paymentMethod = await stripe.paymentMethods.attach(pmId, {
    customer: context.customer.id
  });
  expect(context.paymentMethod.id).toBe(pmId);
  expect(context.paymentMethod.customer).toBe(context.customer.id);
});

Then('the customer should have {int} saved payment method', async (expectedCount: number) => {
  if (!context.customer) throw new Error('Customer not initialized');
  const paymentMethods = await stripe.paymentMethods.list({
    customer: context.customer.id,
    type: 'card'
  });
  expect(paymentMethods.data.length).toBe(expectedCount);
});

Then('the payment method should be valid', async () => {
  if (!context.paymentMethod) throw new Error('Payment method not initialized');
  const currentPM = await stripe.paymentMethods.retrieve(
    context.paymentMethod.id
  );
  expect(currentPM.card?.exp_year).toBeGreaterThan(new Date().getFullYear());
  expect(currentPM.card?.last4).toHaveLength(4);
});

After(async () => {
  try {
    if (context.customer?.id) {
      if (context.paymentMethod?.id) {
        await stripe.paymentMethods.detach(context.paymentMethod.id);
      }
      await stripe.customers.del(context.customer.id);
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});
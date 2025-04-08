import { Given, When, Then, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import Stripe from 'stripe';
import { stripe, StripeTestContext } from '../../utilities/stripeClient';

interface PaymentTestContext {
  customer?: Stripe.Customer;
  paymentIntent?: Stripe.PaymentIntent;
  paymentMethod?: Stripe.PaymentMethod;
}

const context: PaymentTestContext = {};

Given('I have a test customer with email {string}', async (email: string) => {
  context.customer = await stripe.customers.create({
    email,
    name: 'Test Customer'
  });
  expect(context.customer.id).toBeTruthy();
  expect(context.customer.email).toBe(email);
});

When('I create a payment intent for {int} USD', async (amount: number) => {
  if (!context.customer) throw new Error('Customer not initialized');
  context.paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: context.customer.id,
    payment_method_types: ['card'],
    description: 'Cucumber Test Payment'
  });
  
  expect(context.paymentIntent.id).toBeTruthy();
  expect(context.paymentIntent.amount).toBe(amount);
  expect(context.paymentIntent.status).toBe('requires_payment_method');
});

When('I attach a valid test payment method {string}', async (pmId: string) => {
  if (!context.customer || !context.paymentIntent) {
    throw new Error('Customer or PaymentIntent not initialized');
  }
  context.paymentMethod = await stripe.paymentMethods.attach(pmId, {
    customer: context.customer.id
  });
  context.paymentIntent = await stripe.paymentIntents.update(
    context.paymentIntent.id,
    { 
      payment_method: pmId,
      receipt_email: context.customer.email 
    }
  );
  expect(context.paymentMethod.id).toBe(pmId);
  expect(context.paymentIntent.payment_method).toBe(pmId);
});

When('I confirm the payment intent', async () => {
  if (!context.paymentIntent) throw new Error('PaymentIntent not initialized');
  context.paymentIntent = await stripe.paymentIntents.confirm(
    context.paymentIntent.id,
    { return_url: 'https://example.com/return' }
  );
  expect(context.paymentIntent.status).toBeTruthy();
});

Then('the payment status should be {string}', async (expectedStatus: string) => {
  if (!context.paymentIntent) throw new Error('PaymentIntent not initialized');
  const currentPayment = await stripe.paymentIntents.retrieve(context.paymentIntent.id);
  expect(currentPayment.status).toBe(expectedStatus);
});

Then('I should receive a payment confirmation webhook', async () => {
  if (!context.paymentIntent) throw new Error('PaymentIntent not initialized');
  
  // In a real test, you would verify the webhook was received
  // This is a placeholder for actual webhook verification logic
  expect(context.paymentIntent.id).toBeTruthy();
  
  // Example of what you might assert:
  // const webhookEvent = await getLastWebhookEvent('payment_intent.succeeded');
  // expect(webhookEvent.data.object.id).toBe(context.paymentIntent.id);
});

// Cleanup after scenarios
After(async () => {
  try {
    if (context.customer?.id) {
      await stripe.customers.del(context.customer.id);
    }
    if (context.paymentIntent?.id) {
      await stripe.paymentIntents.cancel(context.paymentIntent.id);
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});
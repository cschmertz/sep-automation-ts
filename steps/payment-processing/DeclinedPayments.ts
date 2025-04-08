import { Given, When, Then, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import Stripe from 'stripe';
import { stripe, StripeTestContext } from '../../utilities/stripeClient';

interface DeclinedPaymentContext {
  customer?: Stripe.Customer;
  paymentIntent?: Stripe.PaymentIntent;
  error?: any;
}

const context: DeclinedPaymentContext = {};

Given('I have a test customer with email {string}', async (email: string) => {
  context.customer = await stripe.customers.create({
    email,
    name: 'Declined Payment User'
  });
  expect(context.customer.email).toBe(email);
});

When('I create a payment intent for {int} USD', async (amount: number) => {
  if (!context.customer) throw new Error('Customer not initialized');
  
  context.paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: context.customer.id,
    payment_method_types: ['card']
  }); 
  expect(context.paymentIntent.id).toBeTruthy();
  expect(context.paymentIntent.amount).toBe(amount);
});

When('I attach a declined test payment method {string}', async (pmId: string) => {
  if (!context.customer || !context.paymentIntent) {
    throw new Error('Customer or PaymentIntent not initialized');
  }

  try {
    await stripe.paymentMethods.attach(pmId, {
      customer: context.customer.id
    });
    context.paymentIntent = await stripe.paymentIntents.update(
      context.paymentIntent.id,
      { payment_method: pmId }
    );
  } catch (err) {
    context.error = err;
  }
});

When('I confirm the payment intent', async () => {
  if (!context.paymentIntent) throw new Error('PaymentIntent not initialized');
  
  try {
    context.paymentIntent = await stripe.paymentIntents.confirm(
      context.paymentIntent.id
    );
  } catch (err) {
    context.error = err;
    context.paymentIntent = await stripe.paymentIntents.retrieve(context.paymentIntent.id);
  }
});

Then('the payment status should be {string}', async (expectedStatus: string) => {
  if (!context.paymentIntent) throw new Error('PaymentIntent not initialized');
  const current = await stripe.paymentIntents.retrieve(context.paymentIntent.id);
  expect(current.status).toBe(expectedStatus);
});

Then('I should receive a payment failed webhook', async () => {
  // In a real implementation, you would:
  // 1. Set up a test webhook endpoint
  // 2. Verify the event was received
  // 3. Check the event type and payload
  
  expect(context.error).toBeTruthy();
  expect(context.error?.type).toBe('StripeCardError');
  
  // Example of what you might assert from a real webhook:
  // const event = await getLastWebhookEvent();
  // expect(event.type).toBe('payment_intent.payment_failed');
  // expect(event.data.object.id).toBe(context.paymentIntent?.id);
});

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
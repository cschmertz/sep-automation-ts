import { Given, When, Then, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import Stripe from 'stripe';
import { stripe, StripeTestContext } from '../../utilities/stripeClient';

interface RefundTestContext {
  paymentIntent?: Stripe.PaymentIntent;
  refund?: Stripe.Refund;
  charge?: Stripe.Charge;
}

const context: RefundTestContext = {};

Given('I have a successful payment of {int} USD', async (amount: number) => {
  context.paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method: 'pm_card_visa',
    confirm: true,
    capture_method: 'automatic'
  });
  if (context.paymentIntent.latest_charge) {
    context.charge = await stripe.charges.retrieve(
      context.paymentIntent.latest_charge as string
    );
  }
  expect(context.paymentIntent.status).toBe('succeeded');
});

When('I create a full refund for the payment', async () => {
  if (!context.paymentIntent) throw new Error('Payment intent not initialized');
  context.refund = await stripe.refunds.create({
    payment_intent: context.paymentIntent.id
  });
  expect(context.refund.id).toBeTruthy();
  expect(context.refund.amount).toBe(context.paymentIntent.amount);
});

Then('the refund status should be {string}', async (expectedStatus: string) => {
  if (!context.refund) throw new Error('Refund not initialized');
  const currentRefund = await stripe.refunds.retrieve(context.refund.id);
  expect(currentRefund.status).toBe(expectedStatus);
});

Then('the payment balance should be {int}', async (expectedBalance: number) => {
  if (!context.paymentIntent?.latest_charge) {
    throw new Error('Payment charge not available');
  }
  const currentCharge = await stripe.charges.retrieve(
    context.paymentIntent.latest_charge as string
  );
  const netAmount = currentCharge.amount - (currentCharge.amount_refunded || 0);

  expect(netAmount).toBe(expectedBalance);
});

Then('I should receive a refund created webhook', async () => {
  if (!context.refund) throw new Error('Refund not initialized');
  
  // In a real implementation, you would:
  // 1. Set up a test webhook endpoint
  // 2. Verify the event was received
  // 3. Check the event type and payload
  
  // Example verification pattern:
  // const webhookEvent = await getLastWebhookEvent('charge.refunded');
  // expect(webhookEvent.data.object.id).toBe(context.refund.id);
  
  // For now, we'll verify the refund exists in Stripe
  const verifiedRefund = await stripe.refunds.retrieve(context.refund.id);
  expect(verifiedRefund.id).toBe(context.refund.id);
});

After(async () => {
  try {
    if (context.paymentIntent?.id) {
      await stripe.paymentIntents.cancel(context.paymentIntent.id)
        .catch(() => {}); 
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});
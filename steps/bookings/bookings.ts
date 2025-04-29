import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from '../../hooks/globalHooks';
import { Booking, BookingWithId } from '../../models/booking';
import { expect } from '@playwright/test';
import { generateBooking } from '../../utilities/generateBooking';

// GET steps
When('I request all booking IDs', async function(this: CustomWorld) {
  const response = await this.apiClient.get('/booking');
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

// POST steps
When('I create a new booking with valid details', async function (this: CustomWorld) {
  const booking = generateBooking();
  this.bookingPayload = booking;
  
  const response = await this.apiClient.post('/booking', booking);
  this.apiResponse = response.data;
  this.apiResponseStatus = response.status;
  this.lastBookingId = response.data.bookingid;
  console.log('Full API Response:', JSON.stringify(response.data, null, 2));
});

// Assertion steps
Then('the API response status should be {int}', function(this: CustomWorld, expectedStatus: number) {
  expect(this.apiResponseStatus).toBe(expectedStatus);
});

Then('the booking data should be returned', function (this: CustomWorld) {
  const actual = this.apiResponse.booking;
  const expected = this.bookingPayload;

  expect(actual.firstname).toBe(expected.firstname);
  expect(actual.lastname).toBe(expected.lastname);
  expect(actual.totalprice).toBe(expected.totalprice);
  expect(actual.depositpaid).toBe(expected.depositpaid);
  expect(actual.additionalneeds).toBe(expected.additionalneeds);
  expect(actual.bookingdates.checkin).toBe(expected.bookingdates.checkin);
  expect(actual.bookingdates.checkout).toBe(expected.bookingdates.checkout);
});

Then('the response should contain booking IDs', function(this: CustomWorld) {
  expect(Array.isArray(this.apiResponse)).toBeTruthy();
  expect(this.apiResponse.length).toBeGreaterThan(0);
  expect(this.apiResponse[0]).toHaveProperty('bookingid');
});

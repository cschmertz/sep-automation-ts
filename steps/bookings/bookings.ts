import { Given, Then, When } from "@cucumber/cucumber";
import { CustomWorld } from '../../hooks/globalHooks';
import { Booking, BookingWithId } from '../../models/booking';
import { expect } from '@playwright/test';

// GET steps
When('I request all booking IDs', async function(this: CustomWorld) {
  const response = await this.apiClient.get('/booking');
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
//   console.log('Booking IDs response:', JSON.stringify(this.apiResponse, null, 2));
});

When('I request booking details for ID {int}', async function(this: CustomWorld, bookingId: number) {
  const response = await this.apiClient.get(`/booking/${bookingId}`);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

// POST steps
When('I create a new booking with the following details:', async function(this: CustomWorld, dataTable) {
  const bookingData = dataTable.rowsHash();
  
  const booking: Booking = {
    firstname: bookingData.firstname,
    lastname: bookingData.lastname,
    totalprice: parseInt(bookingData.totalprice),
    depositpaid: bookingData.depositpaid === 'true',
    bookingdates: {
      checkin: bookingData.checkin,
      checkout: bookingData.checkout
    },
    additionalneeds: bookingData.additionalneeds
  };
  
  const response = await this.apiClient.post('/booking', booking);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

// PUT steps
When('I update booking {int} with the following details:', async function(this: CustomWorld, bookingId: number, dataTable) {
  const bookingData = dataTable.rowsHash();
  
  const booking: Booking = {
    firstname: bookingData.firstname,
    lastname: bookingData.lastname,
    totalprice: parseInt(bookingData.totalprice),
    depositpaid: bookingData.depositpaid === 'true',
    bookingdates: {
      checkin: bookingData.checkin,
      checkout: bookingData.checkout
    },
    additionalneeds: bookingData.additionalneeds
  };
  
  const response = await this.apiClient.put(`/booking/${bookingId}`, booking);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

// PATCH steps
When('I partially update booking {int} with the following details:', async function(this: CustomWorld, bookingId: number, dataTable) {
  const bookingData = dataTable.rowsHash();
  const partialUpdate: Partial<Booking> = {};
  
  if (bookingData.firstname) partialUpdate.firstname = bookingData.firstname;
  if (bookingData.lastname) partialUpdate.lastname = bookingData.lastname;
  if (bookingData.totalprice) partialUpdate.totalprice = parseInt(bookingData.totalprice);
  if (bookingData.depositpaid) partialUpdate.depositpaid = bookingData.depositpaid === 'true';
  if (bookingData.checkin && bookingData.checkout) {
    partialUpdate.bookingdates = {
      checkin: bookingData.checkin,
      checkout: bookingData.checkout
    };
  }
  if (bookingData.additionalneeds) partialUpdate.additionalneeds = bookingData.additionalneeds;
  
  const response = await this.apiClient.patch(`/booking/${bookingId}`, partialUpdate);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

// DELETE steps
When('I delete booking {int}', async function(this: CustomWorld, bookingId: number) {
  const response = await this.apiClient.delete(`/booking/${bookingId}`);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

// Assertion steps
Then('the API response status should be {int}', function(this: CustomWorld, expectedStatus: number) {
  expect(this.apiResponseStatus).toBe(expectedStatus);
});

Then('the response should contain booking IDs', function(this: CustomWorld) {
  expect(Array.isArray(this.apiResponse)).toBeTruthy();
  expect(this.apiResponse.length).toBeGreaterThan(0);
  expect(this.apiResponse[0]).toHaveProperty('bookingid');
});

Then('the booking should have the following details:', function(this: CustomWorld, dataTable) {
  const expectedData = dataTable.rowsHash();
  const booking = this.apiResponse;
  
  if (expectedData.firstname) expect(booking.firstname).toBe(expectedData.firstname);
  if (expectedData.lastname) expect(booking.lastname).toBe(expectedData.lastname);
  if (expectedData.totalprice) expect(booking.totalprice).toBe(parseInt(expectedData.totalprice));
  if (expectedData.depositpaid) expect(booking.depositpaid).toBe(expectedData.depositpaid === 'true');
  if (expectedData.checkin) expect(booking.bookingdates.checkin).toBe(expectedData.checkin);
  if (expectedData.checkout) expect(booking.bookingdates.checkout).toBe(expectedData.checkout);
  if (expectedData.additionalneeds) expect(booking.additionalneeds).toBe(expectedData.additionalneeds);
});

Then('the booking ID should be returned', function(this: CustomWorld) {
  expect(this.apiResponse).toHaveProperty('bookingid');
});

Then('the response should be empty', function(this: CustomWorld) {
  expect(this.apiResponse).toBeFalsy();
});

//helpers
// Store the last created booking ID
When('I use the last created booking ID', function(this: CustomWorld) {
  this.lastBookingId = this.apiResponse.bookingid;
});

// Override all {int} references to pull from stored ID
When('I request booking details for ID {int}', async function(this: CustomWorld, bookingId) {
  const response = await this.apiClient.get(`/booking/${bookingId || this.lastBookingId}`);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

When('I update booking {int} with the following details:', async function(this: CustomWorld, bookingId, dataTable) {
  bookingId = bookingId || this.lastBookingId;
  // rest of your logic...
});

When('I partially update booking {int} with the following details:', async function(this: CustomWorld, bookingId, dataTable) {
  bookingId = bookingId || this.lastBookingId;
  // rest of your logic...
});

When('I delete booking {int}', async function(this: CustomWorld, bookingId) {
  bookingId = bookingId || this.lastBookingId;
  const response = await this.apiClient.delete(`/booking/${bookingId}`);
  this.apiResponseStatus = response.status;
  this.apiResponse = response.data;
});

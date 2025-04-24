import { Booking, BookingDates } from '../models/booking';
import { faker } from '@faker-js/faker';

/**
 * Generate valid check-in and check-out dates
 */
function generateValidBookingDates(): BookingDates {
  const checkin = faker.date.soon({ days: 30 }); // e.g., 5 days from today
  const checkout = new Date(checkin);
  checkout.setDate(checkin.getDate() + faker.number.int({ min: 1, max: 5 })); // 1–5 days after checkin

  return {
    checkin: checkin.toISOString().split('T')[0],
    checkout: checkout.toISOString().split('T')[0],
  };
}


/**
 * Generate a complete Booking object with valid, realistic data
 */
export function generateBooking(): Booking {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 5000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: generateValidBookingDates(),
    additionalneeds: faker.helpers.arrayElement([
      'Breakfast',
      'Lunch',
      'Late Checkout',
      'Airport Pickup',
      'None',
    ]),
  };
}

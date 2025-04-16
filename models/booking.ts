/**
 * Booking dates model
 */
export interface BookingDates {
  checkin: string;
  checkout: string;
}

/**
 * Booking model
 */
export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

/**
 * Booking with ID model
 */
export interface BookingWithId extends Booking {
  bookingid: number;
}

/**
 * Auth token response
 */
export interface TokenResponse {
  token: string;
}

/**
 * Booking ID response
 */
export interface BookingIdResponse {
  bookingid: number;
}
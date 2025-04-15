import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { getStripeCredentials } from '../utilities/jsonUtils';

dotenv.config();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  heardAboutUs: string;
}

export function generateValidUser(): User {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.string.numeric(10).replace(/^0+/, faker.number.int({ min: 1, max: 9 }).toString()),
    heardAboutUs: faker.helpers.arrayElement([
      'Email', 'Facebook', 'Google', 'Instagram', 'LinkedIN',
      'Twitter', 'Referred by a friend or colleague', 'Other'
    ]),
  };
}

interface InvalidUser {
  randomString: string;
  invalidEmailMissingAt: string;
  invalidEmailWithSpace: string;
  invalidEmailMissingDot: string;
}

export function generateInvalidUser(): InvalidUser {
  return {
    randomString: faker.string.alphanumeric(10),
    invalidEmailMissingAt: faker.string.alphanumeric(10) + '.com',
    invalidEmailWithSpace: faker.internet.email().replace('@', ' @'),
    invalidEmailMissingDot: faker.internet.email().replace(/\.(\w+)$/, ''),
  };
}

function getStripeData() {
  const filePath = process.env.STRIPE_CREDENTIALS;
  if (!filePath) throw new Error("STRIPE_CREDENTIALS environment variable is not set.");
  return getStripeCredentials(filePath);
}

export function getRandomCardNumber(): string {
  const { card_numbers } = getStripeData();
  if (!card_numbers || card_numbers.length === 0) throw new Error("No card numbers found in JSON");
  return String(faker.helpers.arrayElement(card_numbers));
}

export function getRandomCountry(): string {
  const { countries } = getStripeData();
  if (!countries || countries.length === 0) throw new Error("No countries found in JSON");
  return faker.helpers.arrayElement(countries);
}

export function generateFutureExpirationDate(): string {
  const today = new Date();
  let month = today.getMonth() + 1;
  let year = today.getFullYear() % 100;
  if (month === 12) {
    month = 1;
    year += 1;
  } else {
    month += 1;
  }
  return `${month.toString().padStart(2, "0")}/${year}`;
}

export function generateRandomCVC(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

export function getIncompleteCardNumber(): string {
  const cardNumber = getRandomCardNumber().replace(/\s+/g, '');
  const pos = Math.floor(Math.random() * cardNumber.length);
  const incomplete = cardNumber.slice(0, pos) + cardNumber.slice(pos + 1);
  return incomplete.match(/.{1,4}/g)?.join(' ') || incomplete;
}

export function getInvalidCardNumber(): string {
  const valid = getRandomCardNumber().replace(/\s+/g, '');
  let invalid = '';
  for (let i = 0; i < 16; i++) {
    invalid += i === 0 ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * 10);
  }
  if (invalid === valid) {
    const lastIndex = invalid.length - 1;
    invalid = invalid.slice(0, lastIndex) + ((+invalid[lastIndex] + 1) % 10);
  }
  return invalid.match(/.{1,4}/g)?.join(' ') || invalid;
}

export function generateIncompleteCVC(): string {
  return Math.floor(1 + Math.random() * 99).toString();
}

export function generatePastExpirationDate(): string {
  const today = new Date();
  const month = Math.floor(Math.random() * 12) + 1;
  const year = (today.getFullYear() - 1) % 100;
  return `${month.toString().padStart(2, "0")}${year.toString().padStart(2, "0")}`;
}

export function generateIncompleteExpirationDate(): string {
  const length = Math.floor(Math.random() * 3) + 1;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)).toString();
}

export function generateExpiredDateThisYear(): string {
  const today = new Date();
  const currentYear = today.getFullYear() % 100;
  const pastMonth = Math.floor(Math.random() * today.getMonth()) + 1;
  return `${pastMonth.toString().padStart(2, "0")}${currentYear.toString().padStart(2, "0")}`;
}

export function generateRandomZipCode(includeExtension: boolean = false): string {
  const mainZipCode = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  if (includeExtension) {
    const extension = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
    return `${mainZipCode}-${extension}`;
  }
  return mainZipCode;
}

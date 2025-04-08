import { faker } from '@faker-js/faker';
import { getTestCardNumbers, getCountriesFromCSV } from '../utilities/csvUtils';
import dotenv from 'dotenv';

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

export async function enterRandomCardDetails(): Promise<string> {
  const filePath = process.env.VALID_CARDS_CSV;
  if (!filePath) throw new Error("VALID_CARDS_CSV environment variable is not set.");
  
  const cardNumbers = await getTestCardNumbers(filePath);
  if (cardNumbers.length === 0) throw new Error("No test card numbers found in CSV");
  
  return cardNumbers[Math.floor(Math.random() * cardNumbers.length)];
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

export async function getRandomCountry(): Promise<string> {
  const filePath = process.env.VALID_COUNTRIES_CSV;
  if (!filePath) throw new Error("VALID_COUNTRIES_CSV environment variable is not set.");
  
  const countries = await getCountriesFromCSV(filePath);
  if (countries.length === 0) throw new Error("No countries found in CSV");
  
  return countries[Math.floor(Math.random() * countries.length)];
}

export async function getIncompleteCardNumber(): Promise<string> {
  const validCardNumber = await enterRandomCardDetails();
  const cleanCardNumber = validCardNumber.replace(/\s+/g, '');
  const positionToRemove = Math.floor(Math.random() * cleanCardNumber.length);
  const incompleteCardNumber = cleanCardNumber.slice(0, positionToRemove) + cleanCardNumber.slice(positionToRemove + 1);
  
  return incompleteCardNumber.match(/.{1,4}/g)?.join(' ') || incompleteCardNumber;
}

export async function getInvalidCardNumber(): Promise<string> {
  const validCardNumber = await enterRandomCardDetails();
  const cleanValidNumber = validCardNumber.replace(/\s+/g, '');
  let randomCardNumber = '';
  const length = 16;
  for (let i = 0; i < length; i++) {
    randomCardNumber += i === 0 ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * 10);
  }
  if (randomCardNumber === cleanValidNumber) {
    const lastIndex = randomCardNumber.length - 1;
    randomCardNumber = randomCardNumber.slice(0, lastIndex) + ((parseInt(randomCardNumber.charAt(lastIndex)) + 1) % 10);
  }
  return randomCardNumber.match(/.{1,4}/g)?.join(' ') || randomCardNumber;
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
  const mainZipCode = Array.from(
    { length: 5 },
    () => Math.floor(Math.random() * 10)
  ).join('');
  if (includeExtension) {
    const extension = Array.from(
      { length: 4 },
      () => Math.floor(Math.random() * 10)
    ).join('');
    return `${mainZipCode}-${extension}`;
  }
  return mainZipCode;
}

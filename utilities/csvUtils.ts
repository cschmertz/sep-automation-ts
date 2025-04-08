import fs from 'fs';
import csv from 'csv-parser';

export function getTestCardNumbers(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const cardNumbers: string[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: { card_number: string }) => {
        cardNumbers.push(row.card_number);
      })
      .on('end', () => {
        resolve(cardNumbers);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}

export function getCountriesFromCSV(filePath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const countries: string[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: { country?: string }) => {
        // Extract the country name from the row
        if (row.country) {
          countries.push(row.country);
        }
      })
      .on('end', () => {
        resolve(countries);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}
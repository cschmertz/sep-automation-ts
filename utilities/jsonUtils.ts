import fs from 'fs';

export function getStripeCredentials(filePath: string): { card_numbers: number[], countries: string[] } {
  if (!fs.existsSync(filePath)) {
    throw new Error(`JSON file not found at path: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

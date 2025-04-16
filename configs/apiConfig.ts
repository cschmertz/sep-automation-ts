import dotenv from 'dotenv';

dotenv.config();

/**
 * API configuration
 */
export const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
  auth: {
    username: process.env.API_USERNAME || 'admin',
    password: process.env.API_PASSWORD || 'password123',
  },
  timeout: 30000,
};
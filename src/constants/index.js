import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Визначаємо кореневу папку проєкту (папка, в якій лежить src)
const ROOT_DIR = path.resolve(__dirname, '..'); // Якщо config.js у src/constants, то ../ веде до src

// Тепер визначаємо шлях до папки з шаблонами, відносно кореня проєкту
export const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');

// Конфігурація SMTP
export const SMTP = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
};

// Конфігурація Cloudinary
export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

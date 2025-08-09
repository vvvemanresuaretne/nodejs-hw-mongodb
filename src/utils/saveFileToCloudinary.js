import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js'; // предположим, что там CLOUD_NAME, API_KEY, API_SECRET

// Получаем переменные окружения один раз
const cloudName = getEnvVar('CLOUDINARY_CLOUD_NAME');
const apiKey = getEnvVar('CLOUDINARY_API_KEY');
const apiSecret = getEnvVar('CLOUDINARY_API_SECRET');

// Конфигурируем Cloudinary
cloudinary.config({
  secure: true,
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Функция загрузки файла
export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};

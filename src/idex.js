import { config } from 'dotenv';
import { setupServer } from './server.js';

// Завантаження змінних оточення
config();

// Запуск сервера
setupServer();

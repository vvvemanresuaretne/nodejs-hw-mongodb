// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; // подключаем роутер аутентификации
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser()); // подключаем cookie-parser до роутов

  // Роуты
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter); // регистрация маршрутов аутентификации

  // Обработка несуществующих роутов – должна идти после всех app.use()
  app.use(notFoundHandler);

  // Централизованный обработчик ошибок (последний middleware)
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

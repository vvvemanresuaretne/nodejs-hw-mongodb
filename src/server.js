import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());  // подключаем cookieParser до роутов!

  // Роуты
  app.use('/auth', authRouter);        // подключаем роуты аутентификации на /auth
  app.use('/contacts', contactsRouter);

  // Обработка несуществующих маршрутов (должна идти после всех app.use)
  app.use(notFoundHandler);

  // Централизованный обработчик ошибок (последний middleware)
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

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

  // ===== ЛОГИРУЕМ ВСЕ ВХОДЯЩИЕ ЗАПРОСЫ =====
  app.use((req, res, next) => {
    console.log(`--> ${req.method} ${req.originalUrl}`);
    next();
  });

  // Подключаем middleware для CORS, логгирования, парсинга JSON и cookie
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  // Подключаем роутеры
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Обработка несуществующих маршрутов
  app.use(notFoundHandler);

  // Централизованный обработчик ошибок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}



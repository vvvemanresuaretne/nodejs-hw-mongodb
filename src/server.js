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

  // Подключаем middleware для CORS, логгирования, парсинга JSON и cookie
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  // Подключаем роутеры
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Обработка несуществующих маршрутов — должно быть после всех роутов!
  app.use(notFoundHandler);

  // Централизованный обработчик ошибок — должен быть последним middleware
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


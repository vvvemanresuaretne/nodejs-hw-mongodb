// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Роутинг контактів
  app.use('/contacts', contactsRouter);

  // Обробка неіснуючих роутів (повинна бути після всіх app.use)
  app.use(notFoundHandler);

  // Централізований error handler (завжди останній)
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    app.use(cookieParser());

  });
}

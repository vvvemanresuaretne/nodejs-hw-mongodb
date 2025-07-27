import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getContacts, getContact } from './controllers/contactsController.js';

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Роуты для contacts
  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact); // ✅ новый роут

  // Обробка неіснуючих роутів
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

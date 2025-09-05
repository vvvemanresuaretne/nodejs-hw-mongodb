import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';

import isValidId from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { contactCreateSchema, contactUpdateSchema } from '../schemas/contactSchemas.js';
import { getContacts } from '../controllers/contactsController.js';
import { addContact, patchContact } from '../controllers/contacts.js';
import { removeContactById } from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import upload from '../middlewares/upload.js'; // multer middleware для фото

const router = express.Router();

// Применяем аутентификацию ко всем роутам этого маршрутизатора
router.use(authenticate);

// Получить список всех контактов
router.get('/', ctrlWrapper(getContacts));

// Получить один контакт по id
router.get('/:contactId', isValidId, ctrlWrapper(getContacts));

// Создать контакт с поддержкой фото (multipart/form-data)
router.post(
  '/',
  upload.single('photo'),
  validateBody(contactCreateSchema),
  ctrlWrapper(addContact)
);

// Обновить контакт с поддержкой фото (multipart/form-data)
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContact)
);

// Удалить контакт
router.delete('/:contactId', isValidId, ctrlWrapper(removeContactById));

export default router;

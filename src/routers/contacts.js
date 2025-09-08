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

router.delete('/:contactId', isValidId, async (req, res, next) => {
  try {
    console.log('Delete request ID:', req.params.contactId);
    const deleted = await contactsService.removeContact(req.user.id, req.params.contactId);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    console.log('Contact deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    next(error);
  }
});


export default router;


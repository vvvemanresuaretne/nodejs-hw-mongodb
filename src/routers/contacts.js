import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { contactCreateSchema, contactUpdateSchema } from '../schemas/contactSchemas.js';
import { getContacts, getContact } from '../controllers/contactsController.js';
import { addContact, patchContact } from '../controllers/contacts.js';
import { removeContactById } from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// Применяем аутентификацию ко всем роутам этого маршрутизатора
router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post('/', validateBody(contactCreateSchema), ctrlWrapper(addContact));
router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContact));
router.delete('/:contactId', isValidId, ctrlWrapper(removeContactById));

export default router;

import express from 'express';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import { contactCreateSchema, contactUpdateSchema } from '../schemas/contactSchemas.js';
import { addContact, patchContact } from '../controllers/contacts.js';
import { getContacts, getContact } from '../controllers/contactsController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { removeContactById } from '../services/contacts.js'

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post('/', validateBody(contactCreateSchema), ctrlWrapper(addContact));
router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContact));
router.delete('/:contactId', isValidId, ctrlWrapper(removeContactById));

export default router;

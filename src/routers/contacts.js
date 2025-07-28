import express from 'express';
import { getContacts, getContact } from '../controllers/contactsController.js';
import { addContact } from '../controllers/contacts.js'
import { removeContactById } from '../services/contacts.js'
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// GET /contacts
router.get('/', ctrlWrapper(getContacts));

// GET /contacts/:contactId
router.get('/:contactId', ctrlWrapper(getContact));

// POST /contacts
router.post('/', ctrlWrapper(addContact));

// PATCH /contacts/:contactId
//router.patch('/:contactId', ctrlWrapper(patchContact));

// DELETE /contacts/:contactId
router.delete('/:contactId', ctrlWrapper(removeContactById));

export default router;

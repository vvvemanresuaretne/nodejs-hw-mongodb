import express from 'express';
import { getContacts, getContact, addContact, patchContact, removeContact } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// GET /contacts
router.get('/', ctrlWrapper(getContacts));

// GET /contacts/:contactId
router.get('/:contactId', ctrlWrapper(getContact));

// POST /contacts
router.post('/', ctrlWrapper(addContact));

// PATCH /contacts/:contactId
router.patch('/:contactId', ctrlWrapper(patchContact));

// DELETE /contacts/:contactId
router.delete('/:contactId', ctrlWrapper(removeContact));

export default router;

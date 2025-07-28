import createError from 'http-errors';
import { 
  getAllContacts, 
  getContactById, 
  updateContactById, 
  createContact,
  removeContactById
} from '../services/contacts.js';

// Отримати всі контакти
export async function getContacts(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
}

// Отримати конкретний контакт по id
export async function getContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
}

// Створити новий контакт
export async function addContact(req, res, next) {
  try {
    const { name, phoneNumber, email, isFavourite = false, contactType } = req.body;

    if (!name) {
      throw createError(400, 'Missing required field: name');
    }
    if (!phoneNumber) {
      throw createError(400, 'Missing required field: phoneNumber');
    }
    if (!contactType) {
      throw createError(400, 'Missing required field: contactType');
    }

    const newContact = await createContact({ name, phoneNumber, email, isFavourite, contactType });

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

// Оновити контакт (PATCH)
export async function patchContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await updateContactById(contactId, updateData);

    if (!updatedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
}

// Видалити контакт
export async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const deletedContact = await removeContactById(contactId);

    if (!deletedContact) {
      throw createError(404, "Contact not found");
    }

    res.status(204).send(); // Статус 204, без тіла відповіді
  } catch (error) {
    next(error);
  }
}

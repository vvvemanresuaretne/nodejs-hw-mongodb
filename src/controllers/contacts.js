
import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

// Оновлення контакту по id з урахуванням userId
export const patchContact = async (req, res, next) => {
  try {
    const userId = req.user.id; // отримуємо userId з middleware authenticate
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await contactsService.updateContact(userId, contactId, updateData);

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({
      status: 'success',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export async function addContact(req, res, next) {
  try {
    const userId = req.user.id;  // або req.user._id, як у вас прийнято
    const contactData = req.body;

    // Валідація обов'язкових полів (можна винести в middleware)
    if (!contactData.name) {
      throw createError(400, 'Missing required field: name');
    }
    if (!contactData.phoneNumber) {
      throw createError(400, 'Missing required field: phoneNumber');
    }
    if (!contactData.contactType) {
      throw createError(400, 'Missing required field: contactType');
    }

    const newContact = await contactsService.addContact(userId, contactData);

    res.status(201).json({
      status: 'success',
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

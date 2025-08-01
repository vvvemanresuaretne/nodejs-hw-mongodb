import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';

// Обновление контакта по id с учётом userId
export const patchContact = async (req, res, next) => {
  try {
    const userId = req.user.id; // получаем userId из middleware authenticate
    const { contactId } = req.params;
    const updateData = req.body;

    // Передаем userId первым параметром
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

// Создание контакта с привязкой к userId
export async function addContact(req, res, next) {
  try {
    const userId = req.user.id; // или req.user._id, как у вас принято
    const contactData = req.body;

    // Валидация обязательных полей (можно вынести в middleware)
    if (!contactData.name) {
      throw createError(400, 'Missing required field: name');
    }
    if (!contactData.phoneNumber) {
      throw createError(400, 'Missing required field: phoneNumber');
    }
    if (!contactData.contactType) {
      throw createError(400, 'Missing required field: contactType');
    }

    // Передаем userId первым параметром
    const newContact = await contactsService.addContact(userId, contactData);

    res.status(201).json({
      status: 'success',
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

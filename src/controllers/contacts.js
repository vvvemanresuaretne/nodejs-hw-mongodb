import { Contact } from '../models/contacts.js'; 

// Оновлення контакту по id
export const patchContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, {
      new: true,      // щоб повернути вже оновлену версію документа
      runValidators: true, // щоб запустити валідацію на оновлення
    });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);  // передаємо помилку в error-handler
  }
};

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



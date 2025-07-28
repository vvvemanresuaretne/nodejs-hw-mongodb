import { Contact } from '../models/contacts.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const updateContactById = async (contactId, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true, runValidators: true }
  );
  return updatedContact;
};

export const removeContactById = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

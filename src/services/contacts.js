import { Contact } from '../models/contacts.js';


export const getAllContacts = async () => {
  return Contact.find();
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

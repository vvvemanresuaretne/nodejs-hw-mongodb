import { Contact } from '../models/contacts.js';
import mongoose from 'mongoose';

export async function getAllContacts({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) {
  page = Number(page) < 1 ? 1 : Number(page);
  perPage = Number(perPage) < 1 ? 10 : Number(perPage);

  const skip = (page - 1) * perPage;

  const filter = { userId };

  if (type) filter.contactType = type;

  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = typeof isFavourite === 'string'
      ? isFavourite.toLowerCase() === 'true'
      : Boolean(isFavourite);
  }

  // поля, по которым можно сортировать
  const sortableFields = ['name', 'createdAt', 'updatedAt'];
  const sortField = sortableFields.includes(sortBy) ? sortBy : 'name';
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOption = { [sortField]: sortDirection };

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter).skip(skip).limit(perPage).sort(sortOption),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export async function addContact(userId, contactData) {
  const contactWithUser = { ...contactData, userId };
  console.log('Creating contact:', contactWithUser); // лог для отладки
  return Contact.create(contactWithUser);
}

export async function getContactById(userId, contactId) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  return Contact.findOne({ _id: contactId, userId });
}

export async function updateContact(userId, contactId, updateData) {
  if (!mongoose.isValidObjectId(contactId)) return null;

  const allowedFields = [
    'name',
    'phoneNumber',
    'email',
    'contactType',
    'isFavourite',
    'photo',
  ];

  const filteredData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
  );

  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    filteredData,
    { new: true, runValidators: true }
  );
}

export async function removeContactById(userId, contactId) {
  if (!mongoose.isValidObjectId(contactId)) return null;
  return Contact.findOneAndDelete({ _id: contactId, userId });
}

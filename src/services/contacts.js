import { Contact } from '../models/contacts.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,         // фільтр за contactType
  isFavourite,  // фільтр за "обраним"
}) {
  page = Number(page) < 1 ? 1 : Number(page);
  perPage = Number(perPage) < 1 ? 10 : Number(perPage);

  const skip = (page - 1) * perPage;

  // Побудова об'єкта фільтрації
  const filter = {};

  if (type) {
    filter.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    // Приводимо isFavourite до булевого значення
    if (typeof isFavourite === 'string') {
      // Якщо isFavourite в query прийшов як 'true' або 'false'
      filter.isFavourite = isFavourite.toLowerCase() === 'true';
    } else {
      filter.isFavourite = Boolean(isFavourite);
    }
  }

  // Сортування з урахуванням запиту
  const sortableFields = ['name'];
  const sortField = sortableFields.includes(sortBy) ? sortBy : 'name';
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOption = { [sortField]: sortDirection };

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(filter),     // лічимо по фільтру
    Contact.find(filter)                 // застосовуємо фільтр
      .skip(skip)
      .limit(perPage)
      .sort(sortOption),
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
export async function getContactById(contactId) {
  const contact = await Contact.findById(contactId);
  return contact;
}
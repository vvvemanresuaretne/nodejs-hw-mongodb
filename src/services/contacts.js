import { Contact } from '../models/contacts.js';

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

  const filter = {
    userId,  // фильтруем по userId
  };

  if (type) {
    filter.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    if (typeof isFavourite === 'string') {
      filter.isFavourite = isFavourite.toLowerCase() === 'true';
    } else {
      filter.isFavourite = Boolean(isFavourite);
    }
  }

  const sortableFields = ['name'];
  const sortField = sortableFields.includes(sortBy) ? sortBy : 'name';
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortOption = { [sortField]: sortDirection };

  const [totalItems, contacts] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter)
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

/**
 * Создание нового контакта с привязкой к пользователю
 *
 * @param {string} userId - ID пользователя
 * @param {Object} contactData - Данные контакта
 * @returns {Promise<Object>} - Новый контакт
 */
export async function addContact(userId, contactData) {
  const contactWithUser = { ...contactData, userId };
  return Contact.create(contactWithUser);
}

/**
 * Получение контакта по ID с проверкой принадлежности пользователю
 *
 * @param {string} userId - ID пользователя
 * @param {string} contactId - ID контакта
 * @returns {Promise<Object|null>} - Найденный контакт или null
 */
export async function getContactById(userId, contactId) {
  return Contact.findOne({ _id: contactId, userId });
}

/**
 * Обновление контакта по ID с проверкой принадлежности пользователю
 *
 * @param {string} userId - ID пользователя
 * @param {string} contactId - ID контакта
 * @param {Object} updateData - Данные для обновления
 * @returns {Promise<Object|null>} - Обновлённый контакт или null
 */
export async function updateContact(userId, contactId, updateData) {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true }
  );
}

/**
 * Удаление контакта по ID с проверкой принадлежности пользователю
 *
 * @param {string} userId - ID пользователя
 * @param {string} contactId - ID контакта
 * @returns {Promise<Object|null>} - Удалённый контакт или null
 */
export async function removeContactById(userId, contactId) {
  return Contact.findOneAndDelete({ _id: contactId, userId });
}

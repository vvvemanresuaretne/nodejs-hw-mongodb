import { Contact } from '../models/contacts.js';

/**
 * Отримання списку контактів з пагінацією, фільтрами, сортуванням,
 * тільки для конкретного користувача.
 *
 * @param {Object} params - Параметри пошуку
 * @param {string} params.userId - ID користувача (обов'язково)
 * @param {number} [params.page=1] - Номер сторінки
 * @param {number} [params.perPage=10] - Кількість контактів на сторінку
 * @param {string} [params.sortBy='name'] - Поле для сортування
 * @param {string} [params.sortOrder='asc'] - Напрям сортування ('asc' або 'desc')
 * @param {string} [params.type] - Фільтр за contactType
 * @param {boolean|string} [params.isFavourite] - Фільтр за обраними
 * @returns {Object} Дані з контактами та пагінацією
 */
export async function getAllContacts({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) {
  if (!userId) {
    throw new Error('userId is required');
  }

  page = Number(page) < 1 ? 1 : Number(page);
  perPage = Number(perPage) < 1 ? 10 : Number(perPage);

  const skip = (page - 1) * perPage;

  // Фільтр по userId + додаткові фільтри
  const filter = { userId };

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

  // Сортування
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
 * Створення нового контакту з прив'язкою до користувача
 *
 * @param {string} userId - ID користувача
 * @param {Object} contactData - Дані контакту
 * @returns {Promise<Object>} - Новий контакт
 */
export async function addContact(userId, contactData) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return Contact.create({ ...contactData, userId });
}

/**
 * Отримання контакту за ID для конкретного користувача
 *
 * @param {string} userId - ID користувача
 * @param {string} contactId - ID контакту
 * @returns {Promise<Object|null>} - Знайдений контакт або null
 */
export async function getContactById(userId, contactId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return Contact.findOne({ _id: contactId, userId });
}

/**
 * Оновлення контакту за ID для конкретного користувача
 *
 * @param {string} userId - ID користувача
 * @param {string} contactId - ID контакту
 * @param {Object} updateData - Дані для оновлення
 * @returns {Promise<Object|null>} - Оновлений контакт або null
 */
export async function updateContact(userId, contactId, updateData) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true }
  );
}

/**
 * Видалення контакту за ID для конкретного користувача
 *
 * @param {string} userId - ID користувача
 * @param {string} contactId - ID контакту
 * @returns {Promise<Object|null>} - Видалений контакт або null
 */
export async function removeContactById(userId, contactId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return Contact.findOneAndDelete({ _id: contactId, userId });
}

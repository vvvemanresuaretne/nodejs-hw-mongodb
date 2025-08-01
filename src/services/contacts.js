import { Contact } from '../models/contacts.js';


/**
 * Отримання списку контактів з пагінацією, фільтрами, сортуванням,
 * без прив'язки до користувача.
 *
 * @param {Object} params - Параметри пошуку
 * @param {number} [params.page=1] - Номер сторінки
 * @param {number} [params.perPage=10] - Кількість контактів на сторінку
 * @param {string} [params.sortBy='name'] - Поле для сортування
 * @param {string} [params.sortOrder='asc'] - Напрям сортування ('asc' або 'desc')
 * @param {string} [params.type] - Фільтр за contactType
 * @param {boolean|string} [params.isFavourite] - Фільтр за обраними
 * @returns {Object} Дані з контактами та пагінацією
 */
export async function getAllContacts({
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

  // Фільтр без userId
  const filter = {};

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
 * Створення нового контакту без прив'язки до користувача
 *
 * @param {Object} contactData - Дані контакту
 * @returns {Promise<Object>} - Новий контакт
 */
export async function addContact(contactData) {
  return Contact.create(contactData);
}


/**
 * Отримання контакту за ID без прив'язки до користувача
 *
 * @param {string} contactId - ID контакту
 * @returns {Promise<Object|null>} - Знайдений контакт або null
 */
export async function getContactById(contactId) {
  return Contact.findById(contactId);
}


/**
 * Оновлення контакту за ID без прив'язки до користувача
 *
 * @param {string} contactId - ID контакту
 * @param {Object} updateData - Дані для оновлення
 * @returns {Promise<Object|null>} - Оновлений контакт або null
 */
export async function updateContact(contactId, updateData) {
  return Contact.findByIdAndUpdate(contactId, updateData, { new: true, runValidators: true });
}


/**
 * Видалення контакту за ID без прив'язки до користувача
 *
 * @param {string} contactId - ID контакту
 * @returns {Promise<Object|null>} - Видалений контакт або null
 */
export async function removeContactById(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

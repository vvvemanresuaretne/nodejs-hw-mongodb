import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import cloudinary from '../config/cloudinary.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

// Функция для загрузки фото в Cloudinary из буфера (чтобы работать с memoryStorage multer)
const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'contacts' }, // фото будут храниться в папке contacts
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });

export const patchContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const photo = req.file;

    let photoUrl;

    // Если есть файл — обрабатываем по логике как у patchStudentController
    if (photo) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo); // загрузка в Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(photo); // сохранение локально
      }
    }

    // Собираем данные для обновления
    const updateData = {
      ...req.body,
    };

    // Фото добавляем только если загружено
    if (photoUrl) {
      updateData.photo = photoUrl;
    }

    // Обновляем контакт с учётом userId
    const updatedContact = await contactsService.updateContact(
      userId,
      contactId,
      updateData
    );

    if (!updatedContact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Создание контакта с привязкой к userId + загрузка фото
export async function addContact(req, res, next) {
  try {
    const userId = req.user.id;
    const contactData = { ...req.body };

    // Если фото пришло как файл — загружаем в Cloudinary
    if (req.file) {
      const uploadResult = await uploadFromBuffer(req.file.buffer);
      contactData.photo = uploadResult.secure_url;
    }

    // Валидация обязательных полей (лучше в отдельный middleware с Joi)
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
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
}

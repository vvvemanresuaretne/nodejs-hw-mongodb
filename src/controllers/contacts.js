import createError from 'http-errors';
import * as contactsService from '../services/contacts.js';
import cloudinary from '../config/cloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js'; // додано для локального збереження

const uploadFromBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'contacts', resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });

export const patchContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;

    let photoUrl;

    if (req.file && req.file.buffer) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        try {
          const uploadResult = await uploadFromBuffer(req.file.buffer);
          photoUrl = uploadResult.secure_url;
          console.log('Image uploaded to Cloudinary:', photoUrl);
        } catch (error) {
          return next(createError(500, 'Failed to upload image: ' + error.message));
        }
      } else {
        try {
          photoUrl = await saveFileToUploadDir(req.file);
          console.log('Image saved locally:', photoUrl);
        } catch (error) {
          return next(createError(500, 'Failed to save image locally: ' + error.message));
        }
      }
    }

    const updateData = { ...req.body };
    if (photoUrl) {
      updateData.photo = photoUrl;
    }

    const updatedContact = await contactsService.updateContact(userId, contactId, updateData);

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
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

export async function addContact(req, res, next) {
  try {
    const userId = req.user.id;
    const contactData = { ...req.body };

    if (req.file && req.file.buffer) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        try {
          const uploadResult = await uploadFromBuffer(req.file.buffer);
          contactData.photo = uploadResult.secure_url;
          console.log('Image uploaded to Cloudinary for new contact:', contactData.photo);
        } catch (error) {
          return next(createError(500, 'Failed to upload image: ' + error.message));
        }
      } else {
        try {
          contactData.photo = await saveFileToUploadDir(req.file);
          console.log('Image saved locally for new contact:', contactData.photo);
        } catch (error) {
          return next(createError(500, 'Failed to save image locally: ' + error.message));
        }
      }
    }

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

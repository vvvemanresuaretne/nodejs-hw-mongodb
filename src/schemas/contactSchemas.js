import Joi from 'joi';

// Схема для создания контакта
const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal'),
  // Это поле будет использоваться, если фото передаётся в виде URL
  photo: Joi.string().uri().optional().messages({
    'string.uri': 'Photo must be a valid URL',
  }),
});

// Схема для обновления контакта
const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  phoneNumber: Joi.string().min(3).max(20).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .optional(),
  photo: Joi.string().uri().optional().messages({
    'string.uri': 'Photo must be a valid URL',
  }),
}).min(1); // хотя бы одно поле при обновлении

export { contactCreateSchema, contactUpdateSchema };

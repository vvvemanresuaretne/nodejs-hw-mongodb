// src/schemas/authSchemas.js
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Имя обязательно',
    'string.empty': 'Имя не может быть пустым',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email обязателен',
    'string.email': 'Email должен быть корректным',
    'string.empty': 'Email не может быть пустым',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Пароль обязателен',
    'string.min': 'Пароль должен быть не менее 6 символов',
    'string.empty': 'Пароль не может быть пустым',
  }),
});

import Joi from 'joi';

export const requestResetEmailSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
    }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'Reset token is required',
      'string.empty': 'Reset token cannot be empty',
    }),
  password: Joi.string()
    .trim()
    .min(6)
    // Пример усиленной проверки — пароль должен содержать хотя бы одну букву и цифру
    // .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty',
      'string.pattern.base': 'Password must contain letters and numbers',
    }),
});

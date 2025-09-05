// utils/validateBody.js

import createHttpError from 'http-errors';

/**
 * Middleware для валидации req.body через Joi-схему.
 * - Очищает объект тела от лишних полей (stripUnknown)
 * - Собирает и возвращает сообщения об ошибках (400 Bad Request)
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,     // показать все ошибки, а не первую
      stripUnknown: true,    // убрать неописанные в схеме поля
    });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      console.warn('Validation error:', messages);
      return next(createHttpError(400, `Validation error: ${messages.join(', ')}`));
    }

    req.body = value; // очищенное тело запроса
    next();
  };
};


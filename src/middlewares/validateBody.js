import createHttpError from 'http-errors';

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Собираем массив всех сообщений валидации
      const messages = error.details.map(detail => detail.message);
      // Создаем ошибку 400 Bad Request с сообщением о валидации
      return next(createHttpError(400, `Validation error: ${messages.join(', ')}`));
    }
    next();
  };
};

export default validateBody;
  
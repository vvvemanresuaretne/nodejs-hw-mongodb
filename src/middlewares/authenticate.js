import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  try {
    // verify кидає помилку якщо токен невалідний або протермінований
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Додавання інформації про користувача в req.user (наприклад, id)
    req.user = { id: payload.id };

    next();
  } catch (err) {
    // Якщо причина помилки – протермінований токен
    if (err.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }

    // Усі інші помилки валідації токена, як недійсний чи відсутній
    return next(createHttpError(401, 'Invalid access token'));
  }
}

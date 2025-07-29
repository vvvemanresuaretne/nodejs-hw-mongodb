import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

const SALT_ROUNDS = 10;

export async function registerUser({ name, email, password }) {
  // Перевірка чи існує користувач з таким email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Створення нового користувача
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Повертаємо користувача без пароля!
  const { password: _, ...userData } = user.toObject();
  return userData;
}


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

// Час життя токенів (у секундах)
const ACCESS_TOKEN_LIFETIME = 15 * 60;        // 15 хвилин
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60;  // 30 днів

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  // Видаляємо стару сесію (якщо є)
  await Session.deleteMany({ userId: user._id });

  // Генерація токенів
  const accessToken = jwt.sign(
    { id: user._id },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_LIFETIME }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_LIFETIME }
  );

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_TOKEN_LIFETIME * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_TOKEN_LIFETIME * 1000);

  // Створення нової сесії
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, userId: user._id };
}
export async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const userId = payload.id;

  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // Знайти сесію з таким refreshToken (щоб переконатися, що токен актуальний)
  const session = await Session.findOne({ userId, refreshToken });
  if (!session) {
    // Токен не співпадає з жодною існуючою сесією (можливо відмінений)
    throw createHttpError(401, 'Session not found or has been revoked');
  }

  // Видаляємо стару сесію
  await Session.deleteMany({ userId });

  // Генерація нових токенів
  const newAccessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
  const newRefreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_TOKEN_LIFETIME * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_TOKEN_LIFETIME * 1000);

  // Створення нової сесії
  await Session.create({
    userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
export async function logoutUser({ sessionId, refreshToken }) {
  if (!sessionId) {
    throw createHttpError(400, 'Session ID is required');
  }
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found or token is invalid');
  }

  await Session.deleteOne({ _id: sessionId });
}
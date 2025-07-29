import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Логин пользователя
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, userId } = await loginUser({ email, password });

    // Можно также установить токены в куки, если требуется, например:
    // res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.json({ accessToken, refreshToken, userId });
  } catch (error) {
    next(error);
  }
});

// Обновление сессии (обновление токенов)
router.post('/refresh', async (req, res, next) => {
  try {
    // Получаем refresh token из заголовков или тела запроса
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'] || req.cookies?.refreshToken;
    const tokens = await refreshSession(refreshToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

// Выход пользователя (удаление сессии)
router.post('/logout', async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.body;
    await logoutUser({ sessionId, refreshToken });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

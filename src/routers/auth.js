import express from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', registerController);

// Логин пользователя
router.post('/login', loginController);

// Обновление сессии (обновление токенов)
router.post('/refresh', refreshController);

// Выход пользователя (удаление сессии)
router.post('/logout', logoutController);

export default router;

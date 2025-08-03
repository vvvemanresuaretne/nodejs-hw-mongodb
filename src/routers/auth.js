import express from 'express';
import { registerController, loginController, refreshController, logoutController } from '../controllers/auth.js';
import { requestResetEmailSchema } from '../schemas/resetEmail.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../schemas/resetEmail.js';
import { resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', registerController);

// Логин пользователя
router.post('/login', loginController);

// Обновление сессии (обновление токенов)
router.post('/refresh', refreshController);

// Выход пользователя (удаление сессии)
router.post('/logout', logoutController);

// Сброс e-mail
router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

// Сброс Пароля
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;

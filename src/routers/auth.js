import express from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  requestResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { requestResetEmailSchema, resetPasswordSchema } from '../schemas/resetEmail.js';
import { resetPasswordController } from '../controllers/resetPassword.js'; // вынесли в отдельный файл

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', ctrlWrapper(registerController));

// Логин пользователя
router.post('/login', ctrlWrapper(loginController));

// Обновление токена
router.post('/refresh', ctrlWrapper(refreshController));

// Выход пользователя
router.post('/logout', ctrlWrapper(logoutController));

// Запрос ссылки на сброс пароля
router.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);

// Сброс пароля по JWT-токену
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController) // логика с ТЗ будет внутри
);

export default router;

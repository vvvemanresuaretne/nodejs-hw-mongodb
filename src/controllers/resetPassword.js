import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/User.js';
import Session from '../models/Session.js';
import bcrypt from 'bcryptjs';

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const { email } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // Хэшируем новый пароль
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  // Удаляем все текущие сессии пользователя
  await Session.deleteMany({ userId: user._id });

  return res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

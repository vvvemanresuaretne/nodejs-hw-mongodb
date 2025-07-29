import * as authService from '../services/auth.js';
import createHttpError from 'http-errors';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    const { accessToken, refreshToken } = await authService.loginUser({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
}
export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshSession(refreshToken);

    // Оновлюємо cookie з новим refreshToken
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів у мілісекундах
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}
export async function logout(req, res, next) {
  try {
    const { sessionId } = req.body;  // id сесії очікуємо в тілі запиту
    const { refreshToken } = req.cookies;

    await authService.logoutUser({ sessionId, refreshToken });

    // Видаляємо refreshToken cookie, щоб не залишати старий токен
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send(); // успішний логаут, без тіла відповіді
  } catch (error) {
    next(error);
  }
}
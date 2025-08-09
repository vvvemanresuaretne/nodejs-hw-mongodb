import createHttpError from 'http-errors';
import * as authService from '../services/auth.js';

export async function registerController(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw createHttpError(400, 'Missing required fields: email, password or name');
    }

    const newUser = await authService.registerUser({ email, password, name });

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createHttpError(400, 'Missing required fields: email or password');
    }

    const { accessToken, refreshToken } = await authService.loginUser({ email, password }, {
      accessTokenExpiresIn: '15m',
      refreshTokenExpiresIn: '30d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshSession(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    await authService.logoutUser({ refreshToken });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const requestResetEmailController = async (req, res, next) => {
  try {
    await authService.requestResetToken(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email was successfully sent!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);
    res.status(200).json({
      status: 200,
      message: 'Password was successfully reset!',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

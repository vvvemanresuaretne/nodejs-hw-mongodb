import createHttpError from 'http-errors';

import mongoose from 'mongoose';

import  Session  from '../models/Session.js';
import  User  from '../models/User.js';



export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      return next(createHttpError(401, 'Please provide Authorization header'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    const session = await Session.findOne({ accessToken: token });


    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    const now = new Date();
    if (now > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    // Добавляем пользователя к запросу
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

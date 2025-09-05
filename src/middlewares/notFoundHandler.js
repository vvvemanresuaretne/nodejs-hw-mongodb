import createHttpError from 'http-errors';

export function notFoundHandler(req, res, next) {
  next(createHttpError(404, 'Resource not found'));
}

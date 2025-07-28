import createHttpError from 'http-errors';

export function errorHandler(err, req, res, next) {
  if (createHttpError.isHttpError(err)) {
    const status = err.status || 500;
    res.status(status).json({
      status,
      message: err.message || err.name,
      data: err,
    });
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
}

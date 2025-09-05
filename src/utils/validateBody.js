export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Validation error',
        details: error.details.map(e => e.message),
      });
    }
    next();
  };
};

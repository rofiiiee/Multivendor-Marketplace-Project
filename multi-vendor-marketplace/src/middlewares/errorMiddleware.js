/**
 * Global Error Handling Middleware
 * Catch and format all errors passed via next(new AppError())
 */
module.exports = (err, req, res, next) => {
  // 1) Set default status code and status if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 2) Structure the error response
  const errorResponse = {
    status: err.status,
    message: err.message,
  };

  // 3) Include stack trace ONLY in development mode for debugging
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // 4) Send final response
  res.status(err.statusCode).json(errorResponse);
};
const AppError = require("../utils/appError");

/**
 * Global Error Handling Middleware
 * Catch and format all operational and programming errors
 */
module.exports = (err, req, res, next) => {
  // 1) Set default status code and status if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 2) Handle Error Response based on Environment
  if (process.env.NODE_ENV === "development") {
    // Development Mode: Send full error details including Stack Trace
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production Mode: Send clean, user-friendly messages
    // If error is operational (predictable), send the specific message
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // If error is a bug or unexpected (programming error), hide details
      console.error("ERROR :", err); // Log for the developer in production logs
      res.status(500).json({
        status: "error",
        message: "Something went very wrong! Please try again later.",
      });
    }
  }
};
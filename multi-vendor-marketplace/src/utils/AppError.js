/**
 * Custom Error Class for Operational Errors
 * Used to send formatted, predictable error responses to the client
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    
    // Status is 'fail' for 4xx errors (client) and 'error' for 5xx errors (server)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    
    // Marks the error as operational (predictable), so we can send it to the client
    this.isOperational = true;

    // Captures the stack trace to help identify where the error occurred
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
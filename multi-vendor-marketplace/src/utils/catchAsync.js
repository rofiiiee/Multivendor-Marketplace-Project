/**
 * Global Wrapper for Asynchronous Route Handlers
 * Automatically catches any rejected promises and forwards them to the global error middleware
 * @param {Function} fn - The asynchronous Controller function
 * @returns {Function} - A wrapped function that includes automated error catching
 */
module.exports = (fn) => {
  return (req, res, next) => {
    // Executes the controller function and catches any errors (rejections)
    // Forwards the error to the 'next' middleware (Global Error Handler)
    fn(req, res, next).catch(next);
  };
};
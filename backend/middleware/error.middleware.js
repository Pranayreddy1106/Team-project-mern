// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[${status}] ${message}`);
  
  res.status(status).json({
    success: false,
    message,
    status
  });
};

// Async error wrapper for controllers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

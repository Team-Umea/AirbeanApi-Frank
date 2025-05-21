const handleError = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 500;

  const errorResponse = {
    status: statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Visa stacktrace i utvecklingsläge
  };

  res.status(statusCode).json(errorResponse);
};

export default handleError;

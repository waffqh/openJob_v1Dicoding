const errorHandler = (error, req, res, next) => {
  console.error("Error:", error.message);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    status: "failed",
    message: error.message || "Internal server error",
  });
};

export default errorHandler;

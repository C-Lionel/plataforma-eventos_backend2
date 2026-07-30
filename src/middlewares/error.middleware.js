export const errorHandler = (error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    status: "error",
    message: error.message || "Error interno del servidor"
  });
};
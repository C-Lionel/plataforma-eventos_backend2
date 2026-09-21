export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "ID inválido"
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: error.message
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "El recurso ya existe"
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: error.message || "Error interno del servidor"
  });
};
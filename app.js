import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";

import { initializePassport } from "./src/config/passport.config.js";
import eventsRouter from "./src/routes/events.router.js";
import sessionsRouter from "./src/routes/sessions.router.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Ruta para verificar el estado del servidor
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Servidor activo"
  });
});

// Rutas
app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

// Middleware global de errores
app.use(errorHandler);

export default app;
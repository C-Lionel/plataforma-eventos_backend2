import express from "express";
import eventsRouter from "./src/routes/events.router.js";
import sessionsRouter from "./src/routes/sessions.router.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para verificar el estado del servidor
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Servidor activo"
    });
});

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

app.use(errorHandler);

export default app;
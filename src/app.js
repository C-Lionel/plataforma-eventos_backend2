import express from "express";
import eventsRouter from "./routes/events.router.js";
import sessionsRouter from "./routes/sessions.router.js";

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

export default app;
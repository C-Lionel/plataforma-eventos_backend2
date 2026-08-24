import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./src/config/database.config.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();


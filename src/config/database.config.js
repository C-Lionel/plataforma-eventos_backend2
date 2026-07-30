import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      throw new Error("La variable MONGO_URL no está configurada");
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB conectado correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    throw error;
  }
};
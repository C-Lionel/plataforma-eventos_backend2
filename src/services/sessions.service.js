import { usersRepository } from "../repositories/users.repository.js";
import { hashPassword } from "../utils/hash.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

class SessionsService {
  async register(userData) {
    const {
      first_name,
      last_name,
      email,
      password
    } = userData;

    if (!first_name || !last_name || !email || !password) {
      const error = new Error("Faltan campos obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      const error = new Error("El formato del email no es válido");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      const error = new Error(
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
      );
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await usersRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      const error = new Error("El email ya está registrado");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    const createdUser = await usersRepository.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"
    });

    return {
      id: createdUser._id,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      email: createdUser.email,
      role: createdUser.role
    };
  }
}

export const sessionsService = new SessionsService();
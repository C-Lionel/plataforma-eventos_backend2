import { usersRepository } from "../repositories/users.repository.js";
import { UserDTO } from "../dto/user.dto.js";

import {
  hashPassword,
  comparePassword
} from "../utils/hash.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

class SessionsService {

  buildTokenPayload(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  async register({
    first_name,
    last_name,
    email,
    password
  }) {
    if (!first_name || !last_name || !email || !password) {
      const error = new Error("Faltan campos obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      const error = new Error(
        "El formato del email no es válido"
      );
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

    const existingUser = await usersRepository.findByEmail(
      normalizedEmail
    );

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

    return new UserDTO(createdUser);
  }

  async login(email, password) {
    if (!email || !password) {
      const error = new Error("Faltan campos obligatorios");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await usersRepository.findByEmail(
      normalizedEmail
    );

    if (!user) {
      const error = new Error("Credenciales inválidas");
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await comparePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      const error = new Error("Credenciales inválidas");
      error.statusCode = 401;
      throw error;
    }

    return new UserDTO(user);
  }

  async getAllUsers() {
    const users = await usersRepository.getAll();

    return users.map((user) => new UserDTO(user));
  }

  async getCurrentUser(userId) {
    const user = await usersRepository.getById(userId);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return new UserDTO(user);
  }
}

export const sessionsService = new SessionsService();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { usersRepository } from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { UserDTO } from "../dto/user.dto.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;

          if (!first_name || !last_name || !email || !password) {
            return done(null, false, {
              message: "Faltan campos obligatorios",
              statusCode: 400
            });
          }

          const normalizedEmail = email.trim().toLowerCase();

          if (!EMAIL_REGEX.test(normalizedEmail)) {
            return done(null, false, {
              message: "El formato del email no es válido",
              statusCode: 400
            });
          }

          if (password.length < MIN_PASSWORD_LENGTH) {
            return done(null, false, {
              message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
              statusCode: 400
            });
          }

          const existingUser = await usersRepository.getByEmail(
            normalizedEmail
          );

          if (existingUser) {
            return done(null, false, {
              message: "El email ya está registrado",
              statusCode: 409
            });
          }

          const hashedPassword = await hashPassword(password);

          const createdUser = await usersRepository.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user"
          });

          return done(null, new UserDTO(createdUser));
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          if (!email || !password) {
            return done(null, false, {
              message: "Faltan campos obligatorios",
              statusCode: 400
            });
          }

          const normalizedEmail = email.trim().toLowerCase();

          const user = await usersRepository.getByEmail(normalizedEmail);

          if (!user) {
            return done(null, false, {
              message: "Credenciales inválidas",
              statusCode: 401
            });
          }

          const isValidPassword = await comparePassword(
            password,
            user.password
          );

          if (!isValidPassword) {
            return done(null, false, {
              message: "Credenciales inválidas",
              statusCode: 401
            });
          }

          return done(null, new UserDTO(user));
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => req?.cookies?.currentUser || null
        ]),
        secretOrKey: process.env.JWT_SECRET
      },
      (payload, done) => {
        return done(null, payload);
      }
    )
  );
};
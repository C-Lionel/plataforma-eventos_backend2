import { sessionsService } from "../services/sessions.service.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = (req, res) => {
  res.status(201).json({
    status: "success",
    message: "Registro correcto",
    payload: req.user
  });
};


export const loginUser = (req, res) => {
  const payload = sessionsService.buildTokenPayload(req.user);
  const token = generateToken(payload);

  res.cookie("currentUser", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600000,
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({
    status: "success",
    message: "Login correcto"
  });
};

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const logoutUser = (req, res) => {
  res.clearCookie("currentUser", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({
    status: "success",
    message: "Sesión cerrada"
  });
};
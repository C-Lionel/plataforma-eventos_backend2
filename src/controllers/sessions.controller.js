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

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await sessionsService.getCurrentUser(
      req.user.id
    );

    res.status(200).json({
      status: "success",
      payload: user
    });
  } catch (error) {
    next(error);
  }
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

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await sessionsService.getAllUsers();

    res.status(200).json({
      status: "success",
      payload: users
    });
  } catch (error) {
    next(error);
  }
};
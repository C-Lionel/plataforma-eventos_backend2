import { sessionsService } from "../services/sessions.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await sessionsService.register(req.body);

    res.status(201).json({
      status: "success",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const token = await sessionsService.login(req.body);

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
  } catch (error) {
    next(error);
  }
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
import { Router } from "express";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser
} from "../controllers/sessions.controller.js";

import { authenticate } from "../middlewares/passport.middleware.js";

const router = Router();

router.post(
  "/register",
  authenticate("register"),
  registerUser
);

router.post(
  "/login",
  authenticate("login"),
  loginUser
);

router.get(
  "/current",
  authenticate("current"),
  getCurrentUser
);

router.post("/logout", logoutUser);

export default router;
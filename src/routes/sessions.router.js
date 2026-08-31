import { Router } from "express";

import { authenticate } from "../middlewares/passport.middleware.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import {
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser
} from "../controllers/sessions.controller.js";

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
  auth,
  getCurrentUser
);

router.get(
  "/users",
  auth,
  authorize("admin"),
  getAllUsers
);

router.post("/logout", logoutUser);

export default router;
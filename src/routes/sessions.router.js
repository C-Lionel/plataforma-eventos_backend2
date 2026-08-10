import { Router } from "express";
import {  getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/sessions.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", auth, getCurrentUser);
router.post("/logout", logoutUser);

export default router;
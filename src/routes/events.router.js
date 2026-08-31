import { Router } from "express";
import { auth } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/authorize.middleware.js'
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.middleware.js";
import {
  createEvent,
  getEventById,
  getEvents,
  updateEvent
} from "../controllers/events.controller.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post(
  "/",
  auth,
  authorize("organizer", "admin"),
  createEvent
);
router.put(
  "/:id",
  auth,
  authorize("organizer", "admin"),
  authorizeEventOwnerOrAdmin,
  updateEvent
);

export default router;
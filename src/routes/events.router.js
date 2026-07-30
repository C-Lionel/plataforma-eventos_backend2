import { Router } from "express";
import {
  createEvent,
  getEventById,
  getEvents
} from "../controllers/events.controller.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);

export default router;
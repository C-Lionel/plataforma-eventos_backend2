import { Router } from "express";

import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authorizeEventOwnerOrAdmin } from "../middlewares/authorizeEventOwnerOrAdmin.middleware.js";

import {
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
  updateEventStatus
} from "../controllers/events.controller.js";

import {
  createTicket,
  getTicketsByEvent
} from "../controllers/tickets.controller.js";

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

router.patch(
  "/:id/status",
  auth,
  authorize("organizer", "admin"),
  authorizeEventOwnerOrAdmin,
  updateEventStatus
);

router.post(
  "/:eid/tickets",
  auth,
  createTicket
);

router.get(
  "/:eid/tickets",
  auth,
  authorize("organizer", "admin"),
  authorizeEventOwnerOrAdmin,
  getTicketsByEvent
);

export default router;
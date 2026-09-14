import { Router } from "express";

import { auth } from "../middlewares/auth.middleware.js";

import {
  getMyTickets,
  cancelTicket
} from "../controllers/tickets.controller.js";

const router = Router();

router.get(
  "/my-tickets",
  auth,
  getMyTickets
);

router.patch(
  "/:tid/cancel",
  auth,
  cancelTicket
);

export default router;
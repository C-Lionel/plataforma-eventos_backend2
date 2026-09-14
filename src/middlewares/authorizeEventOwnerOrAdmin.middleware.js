import { eventsRepository } from "../repositories/events.repository.js";

export const authorizeEventOwnerOrAdmin = async (req, res, next) => {

  try {

    const eventId =
      req.params.id || req.params.eid;

    const event = await eventsRepository.getById(eventId);

    if (!event) {

      return res.status(404).json({
        status: "error",
        message: "Evento no encontrado"
      });

    }

    const isAdmin = req.user.role === "admin";

    const isOwner =
      event.organizer?.toString() === req.user.id;

    if (!isAdmin && !isOwner) {

      return res.status(403).json({
        status: "error",
        message: "No tenés permisos para realizar esta acción"
      });

    }

    req.event = event;

    next();

  } catch (error) {

    next(error);

  }

};
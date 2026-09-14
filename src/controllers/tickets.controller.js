import { ticketsService } from "../services/tickets.service.js";

export const createTicket = async (req, res, next) => {
  try {
    const { eid } = req.params;
    const { quantity } = req.body;

    const ticket = await ticketsService.create(
      eid,
      req.user.id,
      quantity
    );

    res.status(201).json({
      status: "success",
      message: "Inscripción realizada correctamente",
      payload: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getMyTickets(
      req.user.id
    );

    res.status(200).json({
      status: "success",
      payload: tickets
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketsByEvent = async (req, res, next) => {
  try {
    const { eid } = req.params;

    const tickets = await ticketsService.getByEvent(
      eid
    );

    res.status(200).json({
      status: "success",
      payload: tickets
    });
  } catch (error) {
    next(error);
  }
};

export const cancelTicket = async (req, res, next) => {
  try {
    const { tid } = req.params;

    const ticket = await ticketsService.cancel(
      tid,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      status: "success",
      message: "Inscripción cancelada correctamente",
      payload: ticket
    });
  } catch (error) {
    next(error);
  }
};
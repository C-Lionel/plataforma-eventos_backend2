import { randomUUID } from "crypto";

import { ticketsRepository } from "../repositories/tickets.repository.js";
import { eventsRepository } from "../repositories/events.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
import { mailService } from "./mail.service.js";

import { TicketDTO } from "../dto/ticket.dto.js";

class TicketsService {

  async create(eventId, userId, quantity) {

    const event = await eventsRepository.getById(eventId);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (event.status !== "published") {
      const error = new Error(
        "El evento no está disponible para inscripciones"
      );
      error.statusCode = 400;
      throw error;
    }

    if (event.date <= new Date()) {
      const error = new Error(
        "No es posible inscribirse a un evento finalizado"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      const error = new Error(
        "La cantidad debe ser un número entero mayor a cero"
      );
      error.statusCode = 400;
      throw error;
    }

    const existingTicket =
      await ticketsRepository.getActiveByUserAndEvent(
        userId,
        eventId
      );

    if (existingTicket) {
      const error = new Error(
        "El usuario ya tiene una inscripción activa para este evento"
      );
      error.statusCode = 409;
      throw error;
    }

    const occupiedCapacity =
      await ticketsRepository.getOccupiedCapacity(eventId);

    const availableCapacity =
      event.capacity - occupiedCapacity;

    if (availableCapacity < quantity) {
      const error = new Error(
        "No hay cupos suficientes para realizar la inscripción"
      );

      error.statusCode = 400;
      throw error;
    }

    const reservationCode = randomUUID();

    const ticket = await ticketsRepository.create({
      user: userId,
      event: eventId,
      quantity,
      status: "confirmed",
      reservationCode
    });

    const user = await usersRepository.getById(userId);

    try {
      await mailService.sendTicketConfirmation({
        to: user.email,
        userName: user.first_name,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode
      });
    } catch (error) {
      console.error(
        "No se pudo enviar el email de confirmación:",
        error.message
      );
    }

    return new TicketDTO(ticket);

  }

  async getMyTickets(userId) {
    const tickets = await ticketsRepository.getByUser(userId);

    return tickets.map((ticket) => new TicketDTO(ticket));
  }

  async getByEvent(eventId) {
    const tickets = await ticketsRepository.getByEvent(eventId);

    return tickets.map((ticket) => new TicketDTO(ticket));
  }

  async cancel(ticketId, userId, userRole) {

    const ticket = await ticketsRepository.getById(ticketId);

    if (!ticket) {
      const error = new Error("Ticket no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isAdmin = userRole === "admin";

    const isOwner =
      ticket.user?.toString() === userId;

    if (!isAdmin && !isOwner) {
      const error = new Error(
        "No tenés permisos para cancelar este ticket"
      );
      error.statusCode = 403;
      throw error;
    }

    if (ticket.status === "cancelled") {
      const error = new Error(
        "El ticket ya se encuentra cancelado"
      );
      error.statusCode = 400;
      throw error;
    }

    const cancelledTicket = await ticketsRepository.update(
      ticketId,
      {
        status: "cancelled",
        cancelledAt: new Date()
      }
    );

    return new TicketDTO(cancelledTicket);
  }

}

export const ticketsService = new TicketsService();
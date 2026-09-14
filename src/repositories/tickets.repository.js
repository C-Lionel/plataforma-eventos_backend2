import { ticketsDAO } from "../dao/tickets.dao.js";

class TicketsRepository {

  async create(data) {
    return ticketsDAO.create(data);
  }

  async getById(id) {
    return ticketsDAO.findById(id);
  }

  async getByUser(userId) {
    return ticketsDAO.findByUser(userId);
  }

  async getByEvent(eventId) {
    return ticketsDAO.findByEvent(eventId);
  }

  async getActiveByUserAndEvent(userId, eventId) {
    return ticketsDAO.findActiveByUserAndEvent(
      userId,
      eventId
    );
  }

  async getOccupiedCapacity(eventId) {
    return ticketsDAO.getOccupiedCapacity(eventId);
  }

  async update(id, data) {
    return ticketsDAO.update(id, data);
  }

}

export const ticketsRepository = new TicketsRepository();
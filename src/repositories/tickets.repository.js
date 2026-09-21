import { ticketsDAO } from "../dao/tickets.dao.js";

class TicketsRepository {
  async create(data) {
    return ticketsDAO.create(data);
  }

  async getById(id) {
    return ticketsDAO.findById(id);
  }

  async getByUser(userId) {
    return ticketsDAO.find(
      { user: userId },
      {
        path: "event",
        select: "title date location"
      }
    );
  }

  async getByEvent(eventId) {
    return ticketsDAO.find({
      event: eventId
    });
  }

  async getActiveByUserAndEvent(userId, eventId) {
    return ticketsDAO.findOne({
      user: userId,
      event: eventId,
      status: { $ne: "cancelled" }
    });
  }

  async getOccupiedCapacity(eventId) {
    return ticketsDAO.getOccupiedCapacity(eventId);
  }

  async update(id, data) {
    return ticketsDAO.update(id, data);
  }
}

export const ticketsRepository = new TicketsRepository();
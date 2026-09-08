import { eventsDAO } from "../dao/events.dao.js";

class EventsRepository {
  async getAll(options) {
    return eventsDAO.findAll(options);
  }

  async getById(id) {
    return eventsDAO.findById(id);
  }

  async create(data) {
    return eventsDAO.create(data);
  }

  async update(id, data) {
    return eventsDAO.update(id, data);
  }
}

export const eventsRepository = new EventsRepository();
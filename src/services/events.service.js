import { eventsRepository } from "../repositories/events.repository.js";

class EventsService {
  async getAll() {
    return eventsRepository.getAll();
  }

  async getById(id) {
    const event = await eventsRepository.getById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return event;
  }

  async create(data) {
    if (!data.title) {
      const error = new Error("El título del evento es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    if (!data.capacity || data.capacity <= 0) {
      const error = new Error("La capacidad debe ser mayor a cero");
      error.statusCode = 400;
      throw error;
    }

    return eventsRepository.create(data);
  }

  async update(id, data) {
    const event = await eventsRepository.getById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return eventsRepository.update(id, data);
  }
}

export const eventsService = new EventsService();
import { eventsRepository } from "../repositories/events.repository.js";

class EventsService {
  async getAll() {
    return eventsRepository.getAll();
  }

  async getById(id) {
    const event = await eventsRepository.getById(id);

    if (!event) {
      throw new Error("Evento no encontrado");
    }

    return event;
  }

  async create(data) {
    if (!data.title) {
      throw new Error("El título del evento es obligatorio");
    }

    if (!data.capacity || data.capacity <= 0) {
      throw new Error("La capacidad debe ser mayor a cero");
    }

    return eventsRepository.create(data);
  }
}

export const eventsService = new EventsService();
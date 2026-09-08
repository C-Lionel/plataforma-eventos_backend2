import { eventsRepository } from "../repositories/events.repository.js";

class EventsService {
  async getAll(query = {}) {
    const {
      status,
      category,
      location,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = "date"
    } = query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = location;
    }

    if (dateFrom || dateTo) {
      filter.date = {};

      if (dateFrom) {
        const parsedDateFrom = new Date(dateFrom);

        if (Number.isNaN(parsedDateFrom.getTime())) {
          const error = new Error(
            "dateFrom tiene un formato de fecha inválido"
          );
          error.statusCode = 400;
          throw error;
        }

        filter.date.$gte = parsedDateFrom;
      }

      if (dateTo) {
        const parsedDateTo = new Date(dateTo);

        if (Number.isNaN(parsedDateTo.getTime())) {
          const error = new Error(
            "dateTo tiene un formato de fecha inválido"
          );
          error.statusCode = 400;
          throw error;
        }

        filter.date.$lte = parsedDateTo;
      }
    }

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1
    ) {
      const error = new Error(
        "La página debe ser un número entero mayor o igual a 1"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1
    ) {
      const error = new Error(
        "El límite debe ser un número entero mayor o igual a 1"
      );
      error.statusCode = 400;
      throw error;
    }

    const result = await eventsRepository.getAll({
      filter,
      page: parsedPage,
      limit: parsedLimit,
      sort
    });

    return {
      data: result.data,
      page: parsedPage,
      limit: parsedLimit,
      total: result.total,
      totalPages: Math.ceil(result.total / parsedLimit)
    };
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

    if (!data.description) {
      const error = new Error("La descripción del evento es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    if (!data.category) {
      const error = new Error("La categoría del evento es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    if (!data.location) {
      const error = new Error("La ubicación del evento es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    if (!data.date) {
      const error = new Error("La fecha del evento es obligatoria");
      error.statusCode = 400;
      throw error;
    }

    const eventDate = new Date(data.date);

    if (Number.isNaN(eventDate.getTime())) {
      const error = new Error(
        "La fecha del evento tiene un formato inválido"
      );
      error.statusCode = 400;
      throw error;
    }

    if (eventDate <= new Date()) {
      const error = new Error(
        "La fecha del evento debe ser futura"
      );
      error.statusCode = 400;
      throw error;
    }

    if (!data.capacity || data.capacity <= 0) {
      const error = new Error(
        "La capacidad debe ser mayor a cero"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      data.price === undefined ||
      data.price === null ||
      data.price < 0
    ) {
      const error = new Error(
        "El precio no puede ser negativo"
      );
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

    if (event.status === "cancelled") {
      const error = new Error(
        "No se puede modificar un evento cancelado"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      data.capacity !== undefined &&
      data.capacity <= 0
    ) {
      const error = new Error(
        "La capacidad debe ser mayor a cero"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      data.price !== undefined &&
      data.price < 0
    ) {
      const error = new Error(
        "El precio no puede ser negativo"
      );
      error.statusCode = 400;
      throw error;
    }

    return eventsRepository.update(id, data);
  }

  async updateStatus(id, status) {
    const allowedStatuses = [
      "draft",
      "published",
      "cancelled",
      "finished"
    ];

    if (!allowedStatuses.includes(status)) {
      const error = new Error(
        "Estado de evento inválido"
      );
      error.statusCode = 400;
      throw error;
    }

    const event = await eventsRepository.getById(id);

    if (!event) {
      const error = new Error("Evento no encontrado");
      error.statusCode = 404;
      throw error;
    }

    if (event.status === "cancelled") {
      const error = new Error(
        "No se puede cambiar el estado de un evento cancelado"
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      status === "published" &&
      (
        event.status === "finished" ||
        event.date <= new Date()
      )
    ) {
      const error = new Error(
        "No se puede publicar un evento finalizado"
      );
      error.statusCode = 400;
      throw error;
    }

    return eventsRepository.update(
      id,
      { status }
    );
  }
}

export const eventsService = new EventsService();
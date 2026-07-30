import { EventModel } from "../models/Event.js";

class EventsDAO {
  async findAll() {
    return EventModel.find().lean();
  }

  async findById(id) {
    return EventModel.findById(id).lean();
  }

  async create(data) {
    return EventModel.create(data);
  }
}

export const eventsDAO = new EventsDAO();
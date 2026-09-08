import { EventModel } from "../models/Event.js";

class EventsDAO {
  async findAll({ filter, page, limit, sort }) {
    const skip = (page - 1) * limit;

    const data = await EventModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await EventModel.countDocuments(filter);

    return {
      data,
      total
    };
  }

  async findById(id) {
    return EventModel.findById(id).lean();
  }

  async create(data) {
    return EventModel.create(data);
  }

  async update(id, data) {
    return EventModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    ).lean();
  }
}

export const eventsDAO = new EventsDAO();
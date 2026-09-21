import mongoose from "mongoose";
import { TicketModel } from "../models/Ticket.js";

class TicketsDAO {
  async create(data) {
    return TicketModel.create(data);
  }

  async findById(id) {
    return TicketModel.findById(id).lean();
  }

  async find(filter, populate = null) {
    let query = TicketModel.find(filter);

    if (populate) {
      query = query.populate(
        populate.path,
        populate.select
      );
    }

    return query.lean();
  }

  async findOne(filter) {
    return TicketModel.findOne(filter).lean();
  }

  async getOccupiedCapacity(eventId) {
    const result = await TicketModel.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId),
          status: { $ne: "cancelled" }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    return result[0]?.total || 0;
  }

  async update(id, data) {
    return TicketModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    ).lean();
  }
}

export const ticketsDAO = new TicketsDAO();
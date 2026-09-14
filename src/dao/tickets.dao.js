import mongoose from "mongoose";
import { TicketModel } from "../models/Ticket.js";

class TicketsDAO {

  async create(data) {
    return TicketModel.create(data);
  }

  async findById(id) {
    return TicketModel.findById(id).lean();
  }

  async findByUser(userId) {
    return TicketModel.find({
      user: userId
    })
      .populate(
        "event",
        "title date location"
      )
      .lean();
  }

  async findByEvent(eventId) {
    return TicketModel.find({
      event: eventId
    }).lean();
  }

  async findActiveByUserAndEvent(userId, eventId) {
    return TicketModel.findOne({
      user: userId,
      event: eventId,
      status: { $ne: "cancelled" }
    }).lean();
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
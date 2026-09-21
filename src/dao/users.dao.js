import { UserModel } from "../models/User.js";

class UsersDAO {
  async findAll() {
    return UserModel.find().lean();
  }

  async findById(id) {
    return UserModel.findById(id).lean();
  }

  async findOne(filter) {
    return UserModel.findOne(filter).lean();
  }

  async create(userData) {
    return UserModel.create(userData);
  }
}

export const usersDAO = new UsersDAO();
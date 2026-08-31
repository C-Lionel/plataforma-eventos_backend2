import { UserModel } from "../models/User.js";

class UsersDAO {
  async findAll() {
  return UserModel.find().lean();
  }

  async findByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  async create(userData) {
    return UserModel.create(userData);
  }
}

export const usersDAO = new UsersDAO();
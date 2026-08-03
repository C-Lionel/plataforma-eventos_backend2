import { UserModel } from "../models/User.js";

class UsersDAO {
  async findByEmail(email) {
    return UserModel.findOne({ email }).lean();
  }

  async create(userData) {
    return UserModel.create(userData);
  }
}

export const usersDAO = new UsersDAO();
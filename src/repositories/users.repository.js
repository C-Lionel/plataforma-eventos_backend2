import { usersDAO } from "../dao/users.dao.js";

class UsersRepository {
  async getAll() {
    return usersDAO.findAll();
  }

  async getById(id) {
    return usersDAO.findById(id);
  }

  async findByEmail(email) {
    return usersDAO.findOne({ email });
  }

  async create(userData) {
    return usersDAO.create(userData);
  }
}

export const usersRepository = new UsersRepository();
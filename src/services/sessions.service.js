import { usersRepository } from "../repositories/users.repository.js";
import { UserDTO } from "../dto/user.dto.js";

class SessionsService {
  
  buildTokenPayload(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

   async getAllUsers() {
    const users = await usersRepository.getAll();
    
    return users.map((user) => new UserDTO(user));
  }
}

export const sessionsService = new SessionsService();
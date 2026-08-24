class SessionsService {
  
  buildTokenPayload(user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }
}

export const sessionsService = new SessionsService();
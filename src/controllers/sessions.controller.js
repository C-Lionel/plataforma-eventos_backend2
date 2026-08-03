import { sessionsService } from "../services/sessions.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await sessionsService.register(req.body);

    res.status(201).json({
      status: "success",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};
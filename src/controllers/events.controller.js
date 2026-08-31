import { eventsService } from "../services/events.service.js";

export const getEvents = async (req, res, next) => {
  try {
    const events = await eventsService.getAll();

    res.status(200).json({
      status: "success",
      payload: events
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await eventsService.getById(id);

    res.status(200).json({
      status: "success",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id
    };

    const event = await eventsService.create(eventData);

    res.status(201).json({
      status: "success",
      message: "Evento creado correctamente",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      organizer,
      ...updateData
    } = req.body;

    const event = await eventsService.update(
      id,
      updateData
    );

    res.status(200).json({
      status: "success",
      message: "Evento actualizado correctamente",
      payload: event
    });
  } catch (error) {
    next(error);
  }
};
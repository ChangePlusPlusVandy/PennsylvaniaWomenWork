import { Request, Response } from "express";
import { Event } from "../model/Event";
import User from "../model/User";
import mongoose from "mongoose";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      date,
      startTime,
      endTime,
      expirationDate,
      userIds = [],
      calendarLink,
      audienceRoles = [], // Array of roles that should see this event
    } = req.body;

    let targetUsers = new Set<string>(); // Use Set to avoid duplicates

    // Add specific users if provided
    if (userIds.length > 0) {
      userIds.forEach((id: string) => targetUsers.add(id));
    }

    // Add users based on roles if any audience roles specified
    if (audienceRoles.length > 0) {
      const usersByRole = await User.find(
        {
          role: { $in: audienceRoles },
        },
        "_id",
      );

      usersByRole.forEach((user) => targetUsers.add(user._id.toString()));
    }

    if (targetUsers.size === 0) {
      return res.status(400).json({
        message:
          "No target users found. Specify either userIds or audienceRoles",
      });
    }

    const newEvent = new Event({
      name,
      description,
      date,
      startTime,
      endTime,
      users: Array.from(targetUsers).map(
        (id) => new mongoose.Types.ObjectId(id),
      ),
      ...(calendarLink && { calendarLink }),
      ...(expirationDate && { expirationDate }),
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      event: savedEvent,
      audienceCount: targetUsers.size,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const getEventsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    const events = await Event.find({
      users: new mongoose.Types.ObjectId(userId),
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: { $gt: now } },
      ],
    });

    if (!events.length) {
      return res.status(404).json({ message: "No events found for this user" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Error retrieving events", error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event", error });
  }
};

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
      userIds,
      calendarLink,
      roles = [],
    } = req.body;

    let targetUsers: string[] = [];

    if (roles.includes("all")) {
      const allUsers = await User.find({}, "_id");
      targetUsers = allUsers.map((user) => user._id.toString());
    } else if (roles.length > 0) {
      const usersByRole = await User.find({ role: { $in: roles } }, "_id");
      targetUsers = usersByRole.map((user) => user._id.toString());
    } else if (userIds.length > 0) {
      targetUsers = userIds;
    } else {
      return res.status(400).json({ message: "No roles or user IDs provided" });
    }

    const newEvent = new Event({
      name,
      description,
      date,
      startTime,
      endTime,
      users: targetUsers.map((id) => new mongoose.Types.ObjectId(id)),
      calendarLink,
    });

    const savedEvent = await newEvent.save();

    res
      .status(201)
      .json({ message: "Event created successfully", event: savedEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const getEventsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const events = await Event.find({
      users: new mongoose.Types.ObjectId(userId),
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

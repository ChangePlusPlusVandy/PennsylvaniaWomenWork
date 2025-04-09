import express from "express";
import {
  createEvent,
  getEventsByUser,
  deleteEvent,
  getEventsBetweenUsers,
} from "../controllers/eventController";

const router = express.Router();

// Route to create a new event
router.post("/", createEvent);

// Route to get all events for a user
router.get("/:userId", getEventsByUser);

// Add this new route
router.delete("/:eventId", deleteEvent);

router.post("/meetings-between-users", getEventsBetweenUsers);

export default router;

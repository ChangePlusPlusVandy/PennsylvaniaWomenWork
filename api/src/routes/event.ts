import express from "express"
import { createEvent, getEventsByUser } from "../controllers/eventController"

const router = express.Router()

// Route to create a new event
router.post("/", createEvent)

// Route to get all events for a user
router.get("/:userId", getEventsByUser)

export default router

import express from "express";
import { Workshop } from "../model/Workshop";
import {
  getWorkshopsForMentee,
  addWorkshopToMentee,
  getMenteeById,
  getAllMentees,
  getMentorsForMentee,
} from "../controllers/menteeController";
import { get } from "http";

const router = express.Router();

// Route to get all workshops for a specific mentee -- assigned
router.get("/:menteeId/workshops", getWorkshopsForMentee);

// Route to add a workshop to a mentee -- assigned
router.put("/:menteeId/add-workshop", addWorkshopToMentee);

router.get("/get-mentee/:menteeId", getMenteeById);

router.get("/all-mentees", getAllMentees);

router.get("/:menteeId/mentors", getMentorsForMentee);

export default router;

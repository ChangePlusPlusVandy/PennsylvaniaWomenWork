import express from "express";
import { Workshop } from "../model/Workshop";
import {
  getWorkshopsForMentee,
  addWorkshopToMentee,
} from "../controllers/menteeController";

const router = express.Router();

// Route to get all workshops for a specific mentee
router.get("/:menteeId/workshops", getWorkshopsForMentee);

// Route to get all workshops for a specific mentee -- assigned
router.get(":menteeId/workshops", getWorkshopsForMentee);

// Route to add a workshop to a mentee -- assigned
router.patch("/:menteeId/add-workshop", addWorkshopToMentee);

export default router;

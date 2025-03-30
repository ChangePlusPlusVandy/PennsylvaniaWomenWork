import express from "express";
import {
  getMenteesForMentor,
  getAllMentors,
} from "../controllers/mentorController";

const router = express.Router();

// Route to get all mentees for a mentor -- in progress
router.get("/:mentorId/mentees", getMenteesForMentor);

router.get("/all-mentors", getAllMentors);

export default router;

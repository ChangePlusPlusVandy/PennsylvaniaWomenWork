import express from "express";
import {
  getMenteesForMentor,
  getAllMentors,
  assignMenteeToMentor,
  getMentorForMentee,
  getMentorById,
} from "../controllers/mentorController";

const router = express.Router();

// Route to get all mentees for a mentor -- in progress
router.get("/:mentorId/mentees", getMenteesForMentor);

router.get("/all-mentors", getAllMentors);

// Assign mentee to mentor
router.put("/:mentorId/assign-mentee", assignMenteeToMentor);

// Route to get a mentee's mentor
router.get("/mentor-for-mentee/:menteeId", getMentorForMentee);

router.get("/get-mentor/:mentorId", getMentorById);

export default router;

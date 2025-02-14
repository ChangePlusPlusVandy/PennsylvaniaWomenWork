import express from "express";
import {
  createUser,
  sendEmail,
  addMeeting,
  getCurrentUser,
  getCurrentUserById,
} from "../controllers/userController";

const router = express.Router();

// Route to create a new user
router.post("/create-user", createUser);

// Route to send an email
router.post("/send-email", sendEmail);

// Route to add a meeting
router.post("/add-meeting", addMeeting);

// Route to get current user information
router.get("/current-user", getCurrentUser);


// Route to get current user information
router.get("/current-userid", getCurrentUserById);

export default router;

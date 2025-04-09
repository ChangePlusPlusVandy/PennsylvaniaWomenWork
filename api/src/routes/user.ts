import express from "express";
import User from "../model/User";
// import { validateAccessToken } from "../controllers/auth0-middleware";
import {
  createUser,
  sendEmail,
  addMeeting,
  getCurrentUser,
  updateUser,
  getCurrentUserById,
  deleteUser,
  getAllStaff,
  getAllBoard,
  getUserById,
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

router.get("/current-userid/:auth_id", getCurrentUserById);

router.put("/:userId", updateUser);

// delete user from auth0 and mongo by id
router.delete("/:userId", deleteUser);

router.get("/all-staff", getAllStaff);
router.get("/all-board", getAllBoard);

router.get("/:userId", getUserById);

export default router;

import express from "express";
import mongoose from "mongoose";
import dbConnect from "../config/db";
import sgMail from "@sendgrid/mail";

const router = express.Router();

// Call the dbConnect function to connect to MongoDB
dbConnect();

// User schema definition
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  role: { type: String, enum: ["mentor", "mentee", "admin"], required: true },
  workshopIDs: [String], // For mentors only
  menteeInfo: [String], // For mentors only
  meetingSchedule: [String], // For mentees only
  mentorData: String, // For mentees only
});

const User = mongoose.model("User", userSchema);

// Route to create a new user
router.post("/create-user", async (req: any, res: any) => {
  const {
    firstName,
    lastName,
    username,
    email,
    role,
    workshopIDs,
    menteeInfo,
    meetingSchedule,
    mentorData,
  } = req.body;

  if (!firstName || !lastName || !username || !email || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new user based on role
  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    role,
    workshopIDs: role === "mentor" ? workshopIDs : undefined,
    menteeInfo: role === "mentor" ? menteeInfo : undefined,
    meetingSchedule: role === "mentee" ? meetingSchedule : undefined,
    mentorData: role === "mentee" ? mentorData : undefined,
  });

  try {
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: "Failed to create user", error });
  }
});

// Test route to check if the API is working
router.post("/test", async (req: any, res: any) => {
  console.log("Received group data:");
  const { name } = req.body;

  return res.status(200).json({ name });
});

router.post("/send-email", async (req: any, res: any) => {
  try {
    const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY || "";
    const SEND_GRID_TEST_EMAIL = process.env.SEND_GRID_TEST_EMAIL || "";

    if (SENDGRID_API_KEY === "" || SEND_GRID_TEST_EMAIL === "") {
      throw new Error("SendGrid API key or test email is missing");
    }

    const { email, name } = req.body;

    sgMail.setApiKey(SENDGRID_API_KEY);

    await sgMail.send({
      to: email,
      from: SEND_GRID_TEST_EMAIL,
      templateId: "d-7e26b82cf8624bafa4077b6ed73b52bf",
      dynamicTemplateData: {
        name: name,
      },
    });

    return res.status(200).json({ message: "Email successfully sent" });
  } catch (err) {
    return res.status(400).json({ message: "Email sending failed" });
  }
});

export default router;

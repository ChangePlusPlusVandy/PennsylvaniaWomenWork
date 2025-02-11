import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import User from "../model/User";

export const createUser = async (req: Request, res: Response) => {
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
    meetings,
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
    meetings: meetings || [],
  });

  try {
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: "Failed to create user", error });
  }
};

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY || "";
    const SEND_GRID_TEST_EMAIL = process.env.SEND_GRID_TEST_EMAIL || "";

    if (SENDGRID_API_KEY === "" || SEND_GRID_TEST_EMAIL === "") {
      throw new Error("SendGrid API key or test email is missing");
    }

    const { email, name, role } = req.body;

    sgMail.setApiKey(SENDGRID_API_KEY);

    const templateId =
      role.toLowerCase().trim() === "mentor"
        ? "d-1694192e437348e2a0517103acae3f00"
        : "d-7e26b82cf8624bafa4077b6ed73b52bf";

    await sgMail.send({
      to: email,
      from: SEND_GRID_TEST_EMAIL,
      templateId: templateId,
      dynamicTemplateData: {
        name: name,
      },
    });

    return res.status(200).json({ message: "Email successfully sent" });
  } catch (err) {
    return res.status(400).json({ message: "Email sending failed" });
  }
};

export const addMeeting = async (req: Request, res: Response) => {
  const { username, meeting, notes } = req.body;

  // Validate required fields
  if (!username || !meeting || !notes) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the user by username
    console.log("Searching for user with username:", username);
    const user = await User.findOne({ username });

    if (!user) {
      console.error(`User not found for username: ${username}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Add the meeting to the user's meetings array
    user.meetings.push({ name: meeting, notes });

    // Save the updated user document
    await user.save();

    console.log("Meeting added successfully for username:", username);
    return res
      .status(200)
      .json({ message: "Meeting added successfully", user });
  } catch (error) {
    console.error("Error adding meeting:", error);
    return res.status(500).json({ message: "Error adding meeting", error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const { username } = req.query; // Pass username as a query parameter

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "role",
    "workshopIDs",
    "menteeInfo",
    "meetingSchedule",
    "mentorData",
    "meetings",
  ];

  try {
    const updateData: Partial<typeof User> = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key as keyof typeof updateData] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};
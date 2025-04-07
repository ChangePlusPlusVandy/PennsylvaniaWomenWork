import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import User from "../model/User";
import {
  createAuthUser,
  createUserLink,
  deleteAuthUser,
} from "../config/auth0-user-management";

export const createUser = async (req: Request, res: Response) => {
  const {
    sub, // Auth0 user ID
    first_name,
    last_name,
    username,
    email,
    role,
    workshops,
    menteeInfo,
    meetingSchedule,
    mentorData,
    meetings,
  } = req.body;

  if (!sub || !first_name || !last_name || !username || !email || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if the user already exists
    let existingUser = await User.findById(sub);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", user: existingUser });
    }

    const newUser = new User({
      _id: sub, // ✅ Store Auth0 sub as `_id`
      first_name,
      last_name,
      username,
      email,
      role,
      workshops: role === "mentor" ? workshops : undefined,
      menteeInfo: role === "mentor" ? menteeInfo : undefined,
      meetingSchedule: role === "mentee" ? meetingSchedule : undefined,
      mentorData: role === "mentee" ? mentorData : undefined,
      meetings: meetings || [],
    });

    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

/**
 * Creates a new auth0 user and invites them
 *
 */
export const sendEmail = async (req: Request, res: Response) => {
  try {
    const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY || "";
    const SEND_GRID_TEST_EMAIL = process.env.SEND_GRID_TEST_EMAIL || "";
    const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL || "";

    if (!SENDGRID_API_KEY || !SEND_GRID_TEST_EMAIL || !PUBLIC_APP_URL) {
      throw new Error(
        "SendGrid API key, test email, public app url is missing",
      );
    }

    const { email, firstName, role } = req.body;

    sgMail.setApiKey(SENDGRID_API_KEY);

    let templateId: string;
    const cleanedUserRole = role.toLowerCase().trim();

    if (cleanedUserRole === "mentor") {
      templateId = "d-1694192e437348e2a0517103acae3f00";
    } else if (cleanedUserRole === "mentee") {
      templateId = "d-7e26b82cf8624bafa4077b6ed73b52bf";
    } else {
      throw new Error("Invalid role type");
    }

    // create the user
    const newUser = await createAuthUser(email);

    // retrieve the reset password link
    const Auth0ResetLink = await createUserLink(newUser.data.user_id);

    await sgMail.send({
      to: email,
      from: SEND_GRID_TEST_EMAIL,
      templateId: templateId,
      dynamicTemplateData: {
        name: `${firstName}`,
        password_reset_link: Auth0ResetLink,
        app_url: PUBLIC_APP_URL,
      },
    });

    return res.status(200).json({ message: "Email successfully sent" });
  } catch (err: any) {
    if (err.message == "User exists") {
      return res.status(409).json({ message: "User already exists" });
    }
    console.error("Failed to send email ", err);
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
      _id: user._id.toString(), // Convert MongoDB ObjectId to string
      username: user.username,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const allowedFields = [
    "first_name",
    "last_name",
    "username",
    "email",
    "role",
    "workshops",
    "menteeInfo",
    "meetingSchedule",
    "mentorData",
    "meetings",
    "profile_picture_id",
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

    const updatedUser = await User.findOneAndUpdate(
      { auth_id: userId },
      { $set: updateData },
      { new: true, runValidators: true }, // Return updated document and validate
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

export const getCurrentUserById = async (req: Request, res: Response) => {
  try {
    const sub = decodeURIComponent(req.params.auth_id);
    console.log("Searching for user with sub:", sub);
    const user = await User.findOne({ auth_id: sub });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { menteeId: userId } = req.params;

  console.log("Deleting user: ", userId);

  if (!userId)
    return res
      .status(400)
      .json({ message: "Invalid request. No user specified" });

  try {
    const deletedUser = await User.findOneAndDelete({ auth_id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found in db" });
    }

    const authDeletedUser = await deleteAuthUser(userId);

    if (authDeletedUser.status !== 204) {
      console.log("Auth user deletion failed. Response: ", authDeletedUser);
      throw new Error("Failed to delete auth user");
    }

    console.log("Deleted auth: ", authDeletedUser);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

import { Request, Response } from "express";
import { Mentor } from "../model/Mentor";
import User from "../model/User";

// Get all mentees and their workshops for a given mentor
export const getMenteesForMentor = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mentorId } = req.params; // Auth0 ID (e.g., "auth0|67c25886597da31e8523d039")

    console.log("Searching for mentees with mentor_id:", mentorId);

    // Find all users where mentor_id matches the given mentorId
    const mentees = await User.find({
      mentor_id: mentorId, // 🔹 Match mentor_id (string) instead of _id
    });

    if (!mentees || mentees.length === 0) {
      console.log("No mentees found for mentor:", mentorId);
      res.status(404).json({ message: "No mentees found for this mentor." });
      return;
    }

    console.log("Mentees found:", mentees.length);
    res.status(200).json({ mentees });
  } catch (error) {
    console.error("Error in getMenteesForMentor:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await User.find({ role: "mentor" });

    if (!mentors || mentors.length === 0) {
      return res.status(404).json({ message: "No mentors found" });
    }

    res.status(200).json(mentors);
  } catch (error) {
    console.error("Error getting all mentors:", error);
    res.status(500).json({ message: "Error retrieving mentors", error });
  }
};
export const assignMenteeToMentor = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;
    const { menteeId } = req.body;

    if (!mentorId || !menteeId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify mentor exists and is a mentor
    const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Verify mentee exists and is a mentee
    const mentee = await User.findOne({ _id: menteeId, role: "mentee" });
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    // Update mentee with mentor ID
    const updatedMentee = await User.findByIdAndUpdate(
      menteeId,
      { mentor_id: mentorId },
      { new: true },
    );

    // Update mentor with mentee ID
    const updatedMentor = await User.findByIdAndUpdate(
      mentorId,
      { $push: { mentees: menteeId } },
      { new: true },
    );

    res.status(200).json({
      message: "Mentee assigned successfully",
      mentor: updatedMentor,
      mentee: updatedMentee,
    });
  } catch (error) {
    console.error("Error assigning mentee to mentor:", error);
    res.status(500).json({
      message: "Error assigning mentee to mentor",
      error,
    });
  }
};

export const getMentorForMentee = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;

    const mentee = await User.findById(menteeId);
    if (!mentee || !mentee.mentor_id) {
      return res
        .status(404)
        .json({ message: "Mentor not found for this mentee" });
    }

    const mentor = await User.findById(mentee.mentor_id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.status(200).json({
      first_name: mentor.first_name,
      last_name: mentor.last_name,
      email: mentor.email,
    });
  } catch (error) {
    console.error("Error fetching mentor for mentee:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMentorById = async (req: Request, res: Response) => {
  try {
    const { mentorId } = req.params;

    if (!mentorId) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    console.log("Fetching mentor with ID:", mentorId);

    const mentor = await User.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Find all mentees assigned to this mentor
    const mentees = await User.find({ mentor_id: mentorId });

    const mentorWithMentees = {
      ...mentor.toObject(),
      mentees,
    };

    res.status(200).json(mentorWithMentees);
  } catch (error) {
    console.error("Error retrieving mentor:", error);
    res.status(500).json({ message: "Error retrieving mentor", error });
  }
};

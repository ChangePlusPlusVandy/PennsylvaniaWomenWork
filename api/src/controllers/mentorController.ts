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
      role: "mentee",
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

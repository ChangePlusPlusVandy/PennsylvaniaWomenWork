import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";
import User from "../model/User";

export const getWorkshopsForMentee = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;
    const workshops = await Workshop.find({ mentee: menteeId });
    res.status(200).json(workshops);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving workshops for mentee", error });
  }
};

export const addWorkshopToMentee = async (req: Request, res: Response) => {
  const { menteeId } = req.params;
  const { workshopId } = req.body;

  if (!menteeId || !workshopId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedMentee = await User.findByIdAndUpdate(
      menteeId,
      { $push: { workshopIDs: workshopId } },
      { new: true, safe: true, upsert: false },
    );

    if (!updatedMentee) {
      return res.status(404).send("Mentee not found");
    }
    res.json(updatedMentee);
  } catch (error) {
    res.status(500).send((error as Error).toString());
  }
};

export const getMenteeById = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;

    if (!menteeId) {
      return res.status(400).json({ message: "Mentee ID is required" });
    }

    console.log("Fetching mentee with ID:", menteeId);

    const mentee = await User.findOne({ _id: menteeId });

    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    res.status(200).json(mentee);
  } catch (error) {
    console.error("Error retrieving mentee:", error);
    res.status(500).json({ message: "Error retrieving mentee", error });
  }
};

export const getAllMentees = async (req: Request, res: Response) => {
  try {
    const mentees = await User.find({ role: "mentee" });

    if (!mentees || mentees.length === 0) {
      return res.status(404).json({ message: "No mentees found" });
    }

    res.status(200).json(mentees);
  } catch (error) {
    console.error("Error getting all mentees:", error);
    res.status(500).json({ message: "Error retrieving mentees", error });
  }
};

import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";
import User from "../model/User";

export const getWorkshopsForMentee = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;
    // Look for workshops where either mentee field matches OR workshop is in mentee's workshopIDs
    const workshops = await Workshop.find({
      $or: [
        { mentee: menteeId },
        { _id: { $in: (await User.findById(menteeId))?.workshopIDs || [] } },
      ],
    });

    if (!workshops || workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found for this user" });
    }

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

  if (!workshopId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedMentee = await User.findByIdAndUpdate(
      menteeId,
      { $push: { workshopIDs: workshopId } },
      { new: true },
    );

    if (!updatedMentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    res.json(updatedMentee);
  } catch (error) {
    res.status(500).json({ message: "Error updating mentee", error });
  }
};

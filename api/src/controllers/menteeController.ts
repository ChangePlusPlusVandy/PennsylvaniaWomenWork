import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";
import User from "../model/User";

export const getWorkshopsForMentee = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;

    // First get the mentee to get their workshop IDs
    const mentee = await User.findById(menteeId);

    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    console.log("Found mentee:", mentee);
    console.log("Mentee workshops:", mentee.workshops);

    // Get full workshop details for each workshop ID
    const workshops = await Workshop.find({
      _id: { $in: mentee.workshops || [] },
    });

    console.log("Found workshops:", workshops);
    res.status(200).json(workshops);
  } catch (error) {
    console.error("Error retrieving workshops for mentee:", error);
    res.status(500).json({
      message: "Error retrieving workshops for mentee",
      error,
    });
  }
};

export const addWorkshopToMentee = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;
    const { workshopId } = req.body;

    console.log("Adding workshop:", workshopId, "to mentee:", menteeId);

    if (!menteeId || !workshopId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the workshop first to verify it exists
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Update the mentee document to include the workshop ID
    const updatedMentee = await User.findByIdAndUpdate(
      menteeId,
      {
        $addToSet: {
          workshops: workshopId, // Add workshop ID to mentee's workshops array
        },
      },
      { new: true },
    );

    if (!updatedMentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }
    // Get full workshop details for response
    const workshops = await Workshop.find({
      _id: { $in: updatedMentee.workshops || [] },
    });

    const menteeWithWorkshops = {
      ...updatedMentee.toObject(),
      workshops: workshops,
    };

    console.log("Successfully assigned workshop to mentee");
    res.status(200).json(menteeWithWorkshops);
  } catch (error) {
    console.error("Error in addWorkshopToMentee:", error);
    res.status(500).json({ message: "Error assigning workshop", error });
  }
};

export const getMenteeById = async (req: Request, res: Response) => {
  try {
    const { menteeId } = req.params;

    if (!menteeId) {
      return res.status(400).json({ message: "Mentee ID is required" });
    }

    console.log("Fetching mentee with ID:", menteeId);

    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }

    // Get full workshop details
    const workshops = await Workshop.find({
      _id: { $in: mentee.workshops || [] },
    });

    const menteeWithWorkshops = {
      ...mentee.toObject(),
      workshops: workshops,
    };

    res.status(200).json(menteeWithWorkshops);
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

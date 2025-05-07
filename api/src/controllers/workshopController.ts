import { Request, Response } from "express";
import { Workshop } from "../model/Workshop";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { deleteResourcesForWorkshop } from "./resourceController";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

// Generate pre-signed URL for file upload
export const generatePresignedUrl = async (req: Request, res: Response) => {
  const { file_name } = req.params; // Use req.params, not req.query

  if (!file_name) {
    return res.status(400).json({ message: "fileName is required" });
  }

  const objectKey = `${Date.now()}-${file_name}`; // Generate a unique file key
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 3600,
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({ url, objectKey }); // Send both URL and object key
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res
      .status(500)
      .json({ message: "Failed to generate pre-signed URL", error });
  }
};

export const createWorkshop = async (req: Request, res: Response) => {
  const { name, description, s3id, coverImageS3id, tags, role } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newWorkshop = new Workshop({
      name,
      description,
      s3id,
      coverImageS3id,
      tags: tags || [],
      role,
    });
    const savedWorkshop = await newWorkshop.save();

    // Success:
    res.status(201).json({
      message: "Workshop created successfully",
      workshop: savedWorkshop,
    });
  } catch (error) {
    console.error("Error saving workshop:", error);
    res.status(500).json({ message: "Failed to create workshop", error });
  }
};

// TODO: convert obj keys to URLs if bucket is public
export const getWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshop", error });
  }
};

export const getWorkshopsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const workshops = await Workshop.find({
      $or: [{ mentor: userId }, { mentee: userId }],
    });

    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found for this user" });
    }

    res.status(200).json(workshops);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshops", error });
  }
};

export const updateWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, tags, role } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      id,
      { name, description, tags, role },
      { new: true },
    );

    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({
      message: "Workshop updated successfully",
      workshop: updatedWorkshop,
    });
  } catch (error) {
    console.error("Error updating workshop:", error);
    res.status(500).json({ message: "Failed to update workshop", error });
  }
};

export const deleteWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteResourcesForWorkshop(id); // Delete resources associated with the workshop

    const deletedWorkshop = await Workshop.findByIdAndDelete(id);
    if (!deletedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res
      .status(200)
      .json({ message: "Workshop deleted successfully", deletedWorkshop });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    res.status(500).json({ message: "Failed to delete workshop", error });
  }
};
// get all workshops

export const getAllWorkshops = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    let query = {};

    // If role is specified, filter workshops by role
    if (role) {
      query = { role: role };
    }

    const workshops = await Workshop.find(query);

    console.log(`Found ${workshops.length} workshops matching query:`, query);

    if (!workshops || workshops.length === 0) {
      return res.status(404).json({ message: "No workshops found" });
    }

    res.status(200).json(workshops);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workshops", error });
  }
};

export const getWorkshopById = async (req: Request, res: Response) => {
  try {
    const { workshopId } = req.params;
    const workshop = await Workshop.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    console.error("Error fetching workshop:", error);
    res.status(500).json({ message: "Error retrieving workshop", error });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    // Use distinct to get unique tags directly from MongoDB
    // not everything in workshops has tags as a field
    const tags = await Workshop.distinct("tags");

    // Filter out null/undefined and sort
    const validTags = tags.filter((tag) => tag).sort();

    res.status(200).json(validTags);
  } catch (error) {
    console.error("Error retrieving workshop tags:", error);
    res.status(500).json({ message: "Error retrieving workshop tags", error });
  }
};

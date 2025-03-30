import { Request, Response } from "express";
import { Resource } from "../model/Resource";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET_NAME;

export const createResource = async (req: Request, res: Response) => {
  const { name, description, s3id, workshopIDs, tags } = req.body;

  if (
    !name ||
    !description ||
    !s3id ||
    !workshopIDs ||
    !Array.isArray(workshopIDs)
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newResource = new Resource({
      name,
      description,
      s3id,
      workshopIDs,
      tags,
    });
    const savedResource = await newResource.save();

    res.status(201).json({
      message: "Resource created successfully",
      resource: savedResource,
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({ message: "Failed to create resource", error });
  }
};

export const getResourcesByWorkshopId = async (req: Request, res: Response) => {
  try {
    const { workshopId } = req.params;
    const resources = await Resource.find({ workshopIDs: workshopId });

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error retrieving resources:", error);
    res.status(500).json({ message: "Error retrieving resources", error });
  }
};

export const generateRetrievalURL = async (req: Request, res: Response) => {
  try {
    const { objectId } = req.params;
    if (!objectId) {
      return res.status(400).json({ message: "Missing objectId parameter" });
    }

    const signedUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: bucketName,
      Key: objectId,
      Expires: 3600,
    });

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Resource.distinct("tags");
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ message: "Error fetching tags", error });
  }
};

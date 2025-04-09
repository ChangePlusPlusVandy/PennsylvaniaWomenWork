import { Request, Response } from "express";
import { BoardFile } from "../model/BoardFile";
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

export const generatePresignedUrl = async (req: Request, res: Response) => {
  const { file_name } = req.params;

  if (!file_name) {
    return res.status(400).json({ message: "fileName is required" });
  }

  const objectKey = `${Date.now()}-${file_name}`;
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 3600,
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({ url, objectKey });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res
      .status(500)
      .json({ message: "Failed to generate pre-signed URL", error });
  }
};

export const createBoardFile = async (req: Request, res: Response) => {
  const { name, description, s3id, tags } = req.body;

  if (!name || !description || !s3id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newBoardFile = new BoardFile({
      name,
      description,
      s3id,
      tags,
    });

    const savedBoardFile = await newBoardFile.save();

    res.status(201).json({
      message: "Board file created successfully",
      boardFile: savedBoardFile,
    });
  } catch (error) {
    console.error("Error creating board file:", error);
    res.status(500).json({ message: "Failed to create board file", error });
  }
};

export const getBoardFiles = async (req: Request, res: Response) => {
  try {
    const boardFiles = await BoardFile.find();
    res.status(200).json(boardFiles);
  } catch (error) {
    console.error("Error retrieving board files:", error);
    res.status(500).json({ message: "Error retrieving board files", error });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    // Find all board files and get their tags
    const files = await BoardFile.find({}, "tags");

    // Flatten the array of tag arrays and get unique values
    const uniqueTags = [...new Set(files.flatMap((file) => file.tags))].sort();

    res.status(200).json(uniqueTags);
  } catch (error) {
    console.error("Error retrieving tags:", error);
    res.status(500).json({ message: "Error retrieving tags", error });
  }
};

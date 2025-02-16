import { Request, Response } from "express";
import { Resource } from "../model/Resource";

export const createResource = async (req: Request, res: Response) => {
  const { name, description, s3id, workshopIDs } = req.body;

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
    const newResource = new Resource({ name, description, s3id, workshopIDs });
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
  const { workshopId } = req.params;

  try {
    const resources = await Resource.find({ workshopIDs: workshopId });

    if (!resources.length) {
      return res
        .status(404)
        .json({ message: "No resources found for this workshop" });
    }

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error retrieving resources:", error);
    res.status(500).json({ message: "Error retrieving resources", error });
  }
};

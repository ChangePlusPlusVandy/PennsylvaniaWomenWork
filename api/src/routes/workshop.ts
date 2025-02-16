import express from "express";
import mongoose from "mongoose";
import {
  createWorkshop,
  getWorkshop,
  getWorkshopsByUserId,
  generatePresignedUrl,
} from "../controllers/workshopController";
import dbConnect from "../config/db";

const router = express.Router();

// Route to create a workshop
router.post("/create-workshop", createWorkshop);

// Call the dbConnect function to connect to MongoDB
dbConnect();

// Workshop schema definition (name (required by user), description (required by user), and S3 bucket ID (not required as user input))
const workshopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String, required: false },
});

const Workshop =
  mongoose.models.Workshop || mongoose.model("Workshop", workshopSchema);

// Route to create a new workshop
router.post("/create-workshop", async (req: any, res: any) => {
  const { name, description, s3id, files } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create a new workshop with
    const newWorkshop = new Workshop({ name, description, s3id });
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
});

// router.post("/workshops", createWorkshop)
// router.get('/workshops/:id', getWorkshop);
router.get(
  "/workshops/:id",
  async (req: express.Request, res: express.Response) => {
    await getWorkshop(req, res);
  },
);

// Route to get workshops by user ID
router.get(
  "/workshops/user/:userId",
  async (req: express.Request, res: express.Response) => {
    await getWorkshopsByUserId(req, res);
  },
);

router.get(
  "/generate-presigned-url",
  async (req: express.Request, res: express.Response) => {
    await generatePresignedUrl(req, res);
  },
);

// POPULATE VERSION (if details of mentor/mentee objects are needed on the frontend like name or picture)

// import express from 'express';
// import { createWorkshop, getWorkshop } from '../controllers/workshopController';

// const router = express.Router();

// router.post('/workshops', createWorkshop);
// router.get('/workshops/:id', getWorkshop);

// export default router;
// Route to get a specific workshop
// router.get("/workshops/:id", getWorkshop);
router.get("/:id", getWorkshop);

// Route to get workshops by user ID
// router.get("/workshops/user/:userId", getWorkshopsByUserId);
router.get("/user/:userId", getWorkshopsByUserId);

export default router;

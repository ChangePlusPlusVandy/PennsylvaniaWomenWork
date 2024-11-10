import express from "express";
import mongoose from "mongoose";
import dbConnect from "../config/db"; // Import the dbConnect function

import { createWorkshop, getWorkshop } from "../controllers/workshopController";

const router = express.Router();

// Call the dbConnect function to connect to MongoDB
dbConnect();

// Workshop schema definition (name and S3 bucket ID)
const workshopIDSchema = new mongoose.Schema({
  name: String,
  s3ID: String,
});

const Workshop = mongoose.model("WorkshopID", workshopIDSchema);

// Route to create a new workshop
router.post("/create-workshop", async (req: any, res: any) => {
  const { name, s3id } = req.body;

  if (!name || !s3id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new workshop
  const newWorkshop = new Workshop({
    name,
    s3id,
  });

  try {
    const savedWorkshop = await newWorkshop.save();
    res.status(201).json({
      message: "Workshop created successfully",
      WorkshopID: savedWorkshop,
    });
  } catch (error) {
    res.status(401).json({ message: "Failed to create workshop", error });
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

// POPULATE VERSION (if details of mentor/mentee objects are needed on the frontend like name or picture)

// import express from 'express';
// import { createWorkshop, getWorkshop } from '../controllers/workshopController';

// const router = express.Router();

// router.post('/workshops', createWorkshop);
// router.get('/workshops/:id', getWorkshop);

// export default router;

export default router;
// NO POPULATE VERSION

import express from "express";
import {
  createWorkshop,
  getWorkshop,
  getWorkshopsByUserId,
  generatePresignedUrl,
  updateWorkshop,
  deleteWorkshop,
  getAllWorkshops,
  getWorkshopById,
} from "../controllers/workshopController";

const router = express.Router();

// Route to create a workshop
router.post("/create-workshop", createWorkshop);

// route to get all workshops
router.get("/get-workshops", getAllWorkshops);

// Route to get a specific workshop -- not wired
router.get("/:id", getWorkshop);

// Route to get workshops by user ID -- not wired
router.get("/user/:userId", getWorkshopsByUserId);

// Route to generate a presigned URL for S3
router.get("/generate-presigned-url/:file_name", generatePresignedUrl);

router.put("/update-workshop/:id", updateWorkshop);

// Route to get a specific workshop -- not wired
router.get("/:id", getWorkshop);

router.delete("/delete-workshop/:id", deleteWorkshop);

router.get("/:workshopId", getWorkshopById);

export default router;

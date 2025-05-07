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
  getAllTags,
} from "../controllers/workshopController";

const router = express.Router();

// Fixed route order - specific routes before parameter routes
router.get("/get-tags", getAllTags);

router.get("/get-workshops", getAllWorkshops);

router.get("/generate-presigned-url/:file_name", generatePresignedUrl);

router.post("/create-workshop", createWorkshop);

// Parameter routes after specific routes
router.get("/user/:userId", getWorkshopsByUserId);

router.get("/:workshopId", getWorkshopById);

router.put("/update-workshop/:id", updateWorkshop);

router.delete("/delete-workshop/:id", deleteWorkshop);

router.get("/all", getAllWorkshops);

export default router;

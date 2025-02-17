import express from "express";
import {
  createResource,
  getResourcesByWorkshopId,
} from "../controllers/resourceController";

const router = express.Router();

// Route to create a resource -- wired
router.post("/create-resource", createResource);

// Route to get resources by workshop ID -- not wired
router.get("/workshop/:workshopId/resources", getResourcesByWorkshopId);

export default router;

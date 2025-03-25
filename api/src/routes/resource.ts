import express from "express";
import {
  createResource,
  getResourcesByWorkshopId,
  generateRetrievalURL,
} from "../controllers/resourceController";

const router = express.Router();

// Route to create a resource -- wired
router.post("/create-resource", createResource);

// Route to get resources by workshop ID -- not wired
router.get("/workshop/:workshopId/resources", getResourcesByWorkshopId);

router.get("/getURL/:objectId", generateRetrievalURL);

export default router;

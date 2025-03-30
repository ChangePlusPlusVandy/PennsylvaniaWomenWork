import express from "express";
import {
  createResource,
  getResourcesByWorkshopId,
  generateRetrievalURL,
  getAllTags,
} from "../controllers/resourceController";

const router = express.Router();

// Route to create a resource -- wired
router.post("/create-resource", createResource);

// Route to get resources by workshop ID -- not wired
router.get("/get-resource-by-workshop/:workshopId", getResourcesByWorkshopId);

router.get("/getURL/:objectId", generateRetrievalURL);

router.get("/all-tags", getAllTags);
export default router;

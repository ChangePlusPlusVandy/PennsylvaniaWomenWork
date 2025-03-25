import express from "express";
import { Workshop } from "../model/Workshop";
import {
  getWorkshopsForMentee,
  addWorkshopToMentee,
  getMenteeById,
} from "../controllers/menteeController";
import { get } from "http";

const router = express.Router();

router.get("/:menteeId/workshops", getWorkshopsForMentee);
router.patch("/:menteeId/add-workshop", addWorkshopToMentee);
router.get("/get-mentee/:menteeId", getMenteeById);
export default router;

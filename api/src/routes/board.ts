import express from "express";
import {
  generatePresignedUrl,
  createBoardFile,
  getBoardFiles,
  getAllTags,
  getBoardFileById,
  getBoardFilesByUserId,
} from "../controllers/boardFileController";

const router = express.Router();

// Route to generate a presigned URL for S3
router.get("/generate-presigned-url/:file_name", generatePresignedUrl);

// Route to create a board file
router.post("/create-board-file", createBoardFile);

// Route to get all board files
router.get("/get-files", getBoardFiles);

// Route to get all tags
router.get("/get-tags", getAllTags);

router.get("/:BoardFileId", getBoardFileById);

router.get("/:boardId/files", getBoardFilesByUserId);

export default router;

import express from "express";
import {
  updateProgress,
  getProgress,
  getAllProgress,
  getProgressPercentage,
} from "../controllers/progress.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// UPDATE PROGRESS (Mark lecture as watched)
router.post("/update", verifyToken, updateProgress);

// GET PROGRESS FOR A SPECIFIC COURSE
router.get("/:courseId", verifyToken, getProgress);

// GET ALL PROGRESS FOR USER
router.get("/", verifyToken, getAllProgress);

// GET PROGRESS PERCENTAGE
router.get("/:courseId/percentage", verifyToken, getProgressPercentage);

export default router;

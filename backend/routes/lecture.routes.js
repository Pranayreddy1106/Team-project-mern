import express from "express";
import {
  addLecture,
  getLectures,
  deleteLecture,
} from "../controllers/lecture.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

// Add lecture (Instructor only)
router.post(
  "/:courseId",
  verifyToken,
  restrictTo("instructor"),
  addLecture
);

// Get all lectures (any authenticated user)
router.get(
  "/:courseId",
  verifyToken,
  getLectures
);

// Delete lecture (Instructor only)
router.delete(
  "/:id",
  verifyToken,
  restrictTo("instructor"),
  deleteLecture
);

export default router;
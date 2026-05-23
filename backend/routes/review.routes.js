import express from "express";
import {
  addReview,
  getCourseReviews,
  getLectureReviews,
} from "../controllers/review.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { requireInstructor } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", verifyToken, addReview);
router.get("/course/:id", verifyToken, getCourseReviews);

export default router;
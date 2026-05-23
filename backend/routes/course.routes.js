import express from "express";
import {
  createCourse,
  getAllCourses,
  isEnrolled,
  getMyCourses,
  getCourseById,
  enrollCourse   // ADD THIS
} from "../controllers/course.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

// GET ALL COURSES
router.get("/", getAllCourses);

// CREATE COURSE (ONLY INSTRUCTOR)
router.post(
  "/",
  verifyToken,
  restrictTo("instructor"),
  createCourse
);

// ENROLL COURSE (STUDENT)
router.post(
  "/:id/enroll",
  verifyToken,
  restrictTo("student"),
  enrollCourse
);

// MY COURSES
router.get("/my", verifyToken, getMyCourses);

// ENROLL CHECK
router.get("/:id/is-enrolled", verifyToken, isEnrolled);

// GET COURSE
router.get("/:id", getCourseById);

export default router;

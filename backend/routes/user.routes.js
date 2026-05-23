import express from "express";
import {
  getUserProfile,
  getMyProfile,
  updateProfile,
  getUserStats,
  getInstructorStats,
  getAllUsers,
  getUsersByRole,
  deleteUser,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/role.middleware.js";

const router = express.Router();

// GET MY PROFILE (Authenticated user)
router.get("/me/profile", verifyToken, getMyProfile);

// GET MY STATS (Authenticated user)
router.get("/me/stats", verifyToken, getUserStats);

// GET INSTRUCTOR STATS (Instructor only)
router.get("/me/instructor-stats", verifyToken, getInstructorStats);

// UPDATE MY PROFILE (Authenticated user)
router.put("/me/profile", verifyToken, updateProfile);

// GET USER PROFILE (Anyone can view public profile)
router.get("/:id", getUserProfile);

// GET ALL USERS (Admin only)
router.get("/", verifyToken, restrictTo("admin"), getAllUsers);

// GET USERS BY ROLE (Admin only)
router.get("/role/:role", verifyToken, restrictTo("admin"), getUsersByRole);

// DELETE USER (Admin only)
router.delete("/:id", verifyToken, restrictTo("admin"), deleteUser);

export default router;

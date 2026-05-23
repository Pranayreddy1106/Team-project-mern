import express from "express";
import {
  createQuiz,
  getQuiz,
  attemptQuiz,
} from "../controllers/quiz.controller.js";

import { verifyToken as auth } from "../middleware/auth.middleware.js";
import { restrictTo as role } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/quiz/:courseId", auth, role("instructor", "admin"), createQuiz);
router.get("/quiz/:courseId", auth, getQuiz);
router.post("/quiz/attempt/:courseId", auth, attemptQuiz);

export default router;

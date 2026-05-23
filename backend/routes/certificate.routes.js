import express from "express";
import {
  generateCertificate,
  getCertificate,
} from "../controllers/certificate.controller.js";

import { verifyToken as auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/certificate/generate", auth, generateCertificate);
router.get("/certificate/:courseId", auth, getCertificate);

export default router;
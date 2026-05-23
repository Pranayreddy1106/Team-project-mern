import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createPaymentAndEnroll } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createPaymentAndEnroll);

export default router;
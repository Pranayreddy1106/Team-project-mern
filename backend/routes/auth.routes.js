import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();


// ================= PUBLIC ROUTES =================
router.post("/register", registerUser);
router.post("/login", loginUser);


// ================= PROTECTED ROUTE =================
router.get("/me", verifyToken, getMe);


// ================= LOGOUT =================
// Note: Since JWT is stateless, logout can be handled on the client by simply deleting the token
router.post("/logout", logoutUser);


export default router;
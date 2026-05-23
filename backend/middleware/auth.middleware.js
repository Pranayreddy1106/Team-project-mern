import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 5. Attach user to request
    req.user = user;
    req.token = token;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
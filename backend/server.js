// server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import { initChatSocket } from "./sockets/chat.socket.js";

const PORT = process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI || process.env.DB_URL || "mongodb://localhost:27017/Team-project-mern";

// Create HTTP server for Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.io
initChatSocket(io);

// Connect to MongoDB and start server
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
};

start();
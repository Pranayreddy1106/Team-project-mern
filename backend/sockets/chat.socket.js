import jwt from "jsonwebtoken";
import { CourseModel } from "../models/Course.js";
import User from "../models/User.js";
import { MessageModel } from "../models/Message.js";

// Store active connections: { courseId: [{ socketId, userId, userName, userRole }, ...] }
const rooms = {};

// Helper function to verify user access to course
const verifyCourseAccess = async (userId, courseId, userRole) => {
  try {
    const course = await CourseModel.findById(courseId);
    
    if (!course) {
      return { allowed: false, reason: "Course not found" };
    }

    // Admins have access to everything
    if (userRole === "admin") {
      return { allowed: true, isAdmin: true };
    }

    // Check if user is instructor of this course
    if (course.instructor.toString() === userId.toString()) {
      return { allowed: true, isInstructor: true };
    }

    // Check if user is enrolled student
    const isEnrolled = course.students.some(
      (id) => id.toString() === userId.toString()
    );

    if (isEnrolled) {
      return { allowed: true, isEnrolled: true };
    }

    return { allowed: false, reason: "Not enrolled in this course" };
  } catch (err) {
    return { allowed: false, reason: "Error verifying course access" };
  }
};

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a chat room (course chat)
    socket.on("join_room", async (data, callback) => {
      try {
        const { token, courseId } = data;

        if (!token || !courseId) {
          return socket.emit("error", { message: "Token and courseId are required" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const userRole = decoded.role;

        // Verify user has access to this course
        const access = await verifyCourseAccess(userId, courseId, userRole);

        if (!access.allowed) {
          return socket.emit("error", {
            message: access.reason || "Access denied to this course",
          });
        }

        // Get user name
        const user = await User.findById(userId);
        const userName = user?.name || "Anonymous";

        // Create room tracking if doesn't exist
        if (!rooms[courseId]) {
          rooms[courseId] = [];
        }

        // Join room
        socket.join(courseId);
        
        // Store user info on socket object for easy access
        socket.userName = userName;
        socket.userId = userId;
        socket.userRole = userRole;
        socket.currentCourseId = courseId;

        // Track connection (allow multiple connections for same user)
        rooms[courseId].push({
          socketId: socket.id,
          userId,
          userName,
          userRole,
          joinedAt: new Date(),
        });

        // Fetch previous messages from DB (last 50)
        const previousMessages = await MessageModel.find({ courseId })
          .sort({ timestamp: -1 })
          .limit(50);
        
        const sortedMessages = previousMessages.reverse();

        // Send previous messages to this user
        socket.emit("load_messages", {
          messages: sortedMessages,
          roomInfo: {
            courseId,
            totalUsers: rooms[courseId].length,
          },
        });

        // Notify others in room
        socket.to(courseId).emit("user_joined", {
          courseId,
          userName,
          message: `${userName} joined the chat`,
          totalUsers: rooms[courseId].length,
        });

        console.log(`User ${userName} (${userId}) joined course chat ${courseId}`);
        
        // Acknowledge join
        if (typeof callback === 'function') callback({ success: true });
      } catch (err) {
        console.error("Join room error:", err);
        socket.emit("error", { message: "Invalid token or access denied" });
      }
    });

    // Send message
    socket.on("send_message", async (data, callback) => {
      try {
        const { courseId, token, message } = data;
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Use info from socket object or find in rooms
        const userName = socket.userName || "Anonymous";
        const userRole = socket.userRole || "student";

        // Store message in DB
        const msgObj = await MessageModel.create({
          courseId,
          userId,
          userName,
          userRole,
          message,
          timestamp: new Date(),
        });

        // Broadcast to room
        io.to(courseId).emit("receive_message", msgObj);
        
        console.log(`Message from ${userName} in ${courseId}: ${message}`);
        
        // Acknowledge success
        if (typeof callback === 'function') callback({ success: true });
      } catch (err) {
        console.error("Send message error:", err);
        if (typeof callback === 'function') callback({ success: false, message: "Unable to send message" });
        socket.emit("error", { message: "Unable to send message" });
      }
    });

    // Leave room
    socket.on("leave_room", (data) => {
      try {
        const { courseId, token } = data;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        socket.leave(courseId);

        const userInfo = rooms[courseId]?.find(
          (u) => u.socketId === socket.id
        );

        if (rooms[courseId]) {
          rooms[courseId] = rooms[courseId].filter(
            (user) => user.socketId !== socket.id
          );
        }

        socket.to(courseId).emit("user_left", {
          courseId,
          userName: userInfo?.userName || "User",
          message: `${userInfo?.userName || "User"} left the chat`,
          totalUsers: rooms[courseId]?.length || 0,
        });

        console.log(`User ${userInfo?.userName} left course chat ${courseId}`);
      } catch (err) {
        socket.emit("error", { message: "Invalid token" });
      }
    });

    // Get room info (users online in course)
    socket.on("get_room_info", async (data) => {
      try {
        const { courseId, token } = data;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Verify user has access
        const access = await verifyCourseAccess(userId, courseId, decoded.role);
        if (!access.allowed) {
          return socket.emit("error", { message: "Access denied" });
        }

        if (rooms[courseId]) {
          socket.emit("room_info", {
            courseId,
            totalUsers: rooms[courseId].length,
            users: rooms[courseId].map((u) => ({
              userId: u.userId,
              userName: u.userName,
              userRole: u.userRole,
            })),
          });
        } else {
          socket.emit("room_info", {
            courseId,
            totalUsers: 0,
            users: [],
          });
        }
      } catch (err) {
        socket.emit("error", { message: "Error getting room info" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove from all rooms
      Object.keys(rooms).forEach((courseId) => {
        const disconnectedUser = rooms[courseId]?.find(
          (u) => u.socketId === socket.id
        );

        if (disconnectedUser) {
          rooms[courseId] = rooms[courseId].filter(
            (user) => user.socketId !== socket.id
          );

          // Notify others
          if (rooms[courseId]?.length > 0) {
            io.to(courseId).emit("user_left", {
              courseId,
              userName: disconnectedUser.userName,
              message: `${disconnectedUser.userName} disconnected`,
              totalUsers: rooms[courseId].length,
            });
          }
        }
      });
    });
  });
};

export default { initChatSocket };

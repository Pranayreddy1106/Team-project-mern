import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["student", "instructor", "admin"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 86400, // Message expires after 24 hours
    },
  },
  {
    versionKey: false,
    timestamps: false, // We use our own timestamp
  }
);

export const MessageModel = model("Message", messageSchema);

import { Schema, model, Types } from "mongoose";

const progressSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    completedLectures: [
      {
        type: Types.ObjectId,
        ref: "Lecture",
      },
    ],
    lastWatched: {
      lectureId: {
        type: Types.ObjectId,
        ref: "Lecture",
      },
      timestamp: {
        type: Number, // in seconds
        default: 0,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  },
);

export const ProgressModel = model("progress", progressSchema);

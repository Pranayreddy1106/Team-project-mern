import { Schema, model, Types } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      required: [true, "Difficulty level is required"],
    },
    thumbnail: {
      type: String,
    },
    instructor: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Instructor ID is required"],
    },
    
      price:{
        type: Number,
        required: [true, "Price is required"],
      },
    
    lectures: [
      {
        type: Types.ObjectId,
        ref: "Lecture",
      },
    ],
    students: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  },
);

export const CourseModel = model("Course", courseSchema); 

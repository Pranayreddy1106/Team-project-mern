import { Schema, model, Types } from "mongoose";

const quizAttemptSchema = new Schema(
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
    score: {
      type: Number,
      required: [true, "Score is required"],
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    answers: {
      type: [Number],
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  }
);

export const QuizAttemptModel = model("QuizAttempt", quizAttemptSchema);
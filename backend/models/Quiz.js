import { Schema, model, Types } from "mongoose";

const questionSchema = new Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length === 4 && arr.every(opt => opt.trim() !== "");
      },
      message: "Must have 4 non-empty options",
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, "Correct answer index is required"],
    min: 0,
    max: 3,
  },
});

const quizSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    questions: [{ type: questionSchema, default: [] }], 
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw", 
  }
);

export const QuizModel = model("Quiz", quizSchema);
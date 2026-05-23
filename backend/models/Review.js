import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
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
    instructorId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Instructor ID is required"],
    },
    lectureId: {
      type: Types.ObjectId,
      ref: "Lecture",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Min rating is 1"],
      max: [5, "Max rating is 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  },
);

// Optional lecture reference for lecture-specific reviews
reviewSchema.add({
  lectureId: { type: Types.ObjectId, ref: "Lecture" }
});

export const ReviewModel = model("review", reviewSchema);

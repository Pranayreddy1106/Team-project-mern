import { Schema, model, Types } from "mongoose";

const resourceSchema = new Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },
});

const lectureSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    embedUrl: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    resources: [{ type: resourceSchema, default: [] }],
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  },
);

export const LectureModel = model("Lecture", lectureSchema);

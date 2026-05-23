import { Schema, model, Types } from "mongoose";

const certificateSchema = new Schema(
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
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  },
);

export const CertificateModel = model("Certificate", certificateSchema);

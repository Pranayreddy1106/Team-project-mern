import { Schema, model, Types } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

//  Prevent duplicate payment for same course
paymentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Payment = model("Payment", paymentSchema);
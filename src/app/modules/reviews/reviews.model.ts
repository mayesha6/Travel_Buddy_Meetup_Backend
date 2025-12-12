import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "TravelPlan",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const Review = model("Review", ReviewSchema);

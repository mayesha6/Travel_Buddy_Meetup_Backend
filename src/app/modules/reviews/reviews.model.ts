import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    plan: { type: Schema.Types.ObjectId, ref: "TravelPlan", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);

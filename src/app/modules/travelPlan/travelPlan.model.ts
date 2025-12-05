import { Schema, model } from "mongoose";
import { ITravelPlan, TravelType, Visibility } from "./travelPlan.interface";

const travelPlanSchema = new Schema<ITravelPlan>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    travelType: {
      type: String,
      enum: Object.values(TravelType),
      default: TravelType.SOLO,
    },
    interests: { type: [String], default: [] },
    visibility: {
      type: String,
      enum: Object.values(Visibility),
      default: Visibility.PUBLIC,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

travelPlanSchema.index({ destination: "text" });

export const TravelPlan = model<ITravelPlan>("TravelPlan", travelPlanSchema);

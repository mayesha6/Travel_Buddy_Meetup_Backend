import { Schema, model } from "mongoose";
import { ISubscription } from "./subscriptions.interface";

const subscriptionSchema = new Schema<ISubscription>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

import { Schema, model, Types } from "mongoose";

export enum RequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface ITravelRequest {
  _id?: Types.ObjectId;
  plan: Types.ObjectId;
  requester: Types.ObjectId;
  message?: string;
  status: RequestStatus;
  createdAt?: Date;
  respondedAt?: Date | null;
}

const travelRequestSchema = new Schema<ITravelRequest>(
  {
    plan: { type: Schema.Types.ObjectId, ref: "TravelPlan", required: true },
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    status: { type: String, enum: Object.values(RequestStatus), default: RequestStatus.PENDING },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

travelRequestSchema.index({ plan: 1 });
travelRequestSchema.index({ requester: 1, plan: 1 }, { unique: false });

export const TravelRequest = model<ITravelRequest>("TravelRequest", travelRequestSchema);

import { Types } from "mongoose";

export enum TravelType {
  SOLO = "SOLO",
  FAMILY = "FAMILY",
  FRIENDS = "FRIENDS",
  COUPLE = "COUPLE",
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface ITravelPlan {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  host: Types.ObjectId;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetMin?: number;
  budgetMax?: number;
  travelType: TravelType;
  interests: string[];
  visibility: Visibility;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
import { Review } from "./reviews.model";
import { TravelPlan } from "../travelPlan/travelPlan.model";
import AppError from "../../errorHelpers/AppErrors";

const createReview = async (userId: string, planId: string, rating: number, comment?: string) => {
  const plan = await TravelPlan.findById(planId);
  if (!plan) throw new AppError(404, "Travel plan not found");

  const review = await Review.create({
    plan: planId,
    user: userId,
    rating,
    comment,
  });

  return review;
};

const listReviews = async (planId: string) => {
  const reviews = await Review.find({ plan: planId }).populate("user", "name picture");
  return reviews;
};

export const ReviewService = {
  createReview,
  listReviews,
};

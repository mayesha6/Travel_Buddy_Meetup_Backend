import { Review } from "./reviews.model";
import { TravelPlan } from "../travelPlan/travelPlan.model";
import AppError from "../../errorHelpers/AppErrors";

// Create a review
const createReview = async (
  userId: string,
  planId: string,
  rating: number,
  comment: string
) => {
  const plan = await TravelPlan.findById(planId);
  if (!plan) throw new AppError(404, "Travel plan not found");

  const review = await Review.create({
    reviewer: userId,
    plan: planId,
    rating,
    comment,
  });

  return review;
};

// List reviews for a plan
const listReviews = async (planId: string) => {
  const reviews = await Review.find({ plan: planId })
    .populate("reviewer", "name picture")
    .sort({ createdAt: -1 }); // recent first
  return reviews;
};

// Update a review
const updateReview = async (
  reviewId: string,
  userId: string,
  rating?: number,
  comment?: string
) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new AppError(404, "Review not found");

  if (review.reviewer.toString() !== userId) {
    throw new AppError(403, "You can only update your own review");
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();
  return review;
};

// Delete a review
const deleteReview = async (reviewId: string, userId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new AppError(404, "Review not found");

  if (review.reviewer.toString() !== userId) {
    throw new AppError(403, "You can only delete your own review");
  }

  await review.deleteOne(); // Mongoose 7-safe
  return review;
};

// Get average rating of a plan
const getAverageRating = async (planId: string) => {
  const result = await Review.aggregate([
    { $match: { plan: planId } },
    {
      $group: {
        _id: "$plan",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { avgRating: 0, totalReviews: 0 };
};

export const ReviewService = {
  createReview,
  listReviews,
  updateReview,
  deleteReview,
  getAverageRating,
};

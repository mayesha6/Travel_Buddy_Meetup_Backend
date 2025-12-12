import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./reviews.service";
import { JwtPayload } from "jsonwebtoken";

// Create a review
const createReview = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { planId, rating, comment } = req.body;

  const review = await ReviewService.createReview(userId, planId, rating, comment);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Review created successfully",
    data: review,
  });
});

// List reviews by plan
const listReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.listReviews(req.params.planId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews fetched successfully",
    data: reviews,
  });
});

// Edit review
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { reviewId, rating, comment } = req.body;

  const updatedReview = await ReviewService.updateReview(reviewId, userId, rating, comment);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review updated successfully",
    data: updatedReview,
  });
});

// Delete review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;
  const { reviewId } = req.params;

  const deletedReview = await ReviewService.deleteReview(reviewId, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Review deleted successfully",
    data: deletedReview,
  });
});

export const ReviewController = {
  createReview,
  listReviews,
  updateReview,
  deleteReview,
};

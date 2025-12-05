import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ReviewService } from "./reviews.service";
import { JwtPayload } from "jsonwebtoken";

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


const listReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await ReviewService.listReviews(req.params.planId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Reviews fetched successfully",
    data: reviews,
  });
});

export const ReviewController = {
  createReview,
  listReviews,
};

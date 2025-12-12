import { Router } from "express";
import { ReviewController } from "./reviews.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createReviewZodSchema, editReviewZodSchema } from "./reviews.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// Create review
router.post(
  "/",
  checkAuth(Role.USER, Role.PREMIUM),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

// List reviews for a plan
router.get("/:planId", ReviewController.listReviews);

// Edit review
router.put(
  "/:reviewId",
  checkAuth(Role.USER, Role.PREMIUM),
  validateRequest(editReviewZodSchema),
  ReviewController.updateReview
);

// Delete review
router.delete(
  "/:reviewId",
  checkAuth(Role.USER, Role.PREMIUM),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;

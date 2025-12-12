import { z } from "zod";

// Create review
export const createReviewZodSchema = z.object({
  planId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

// Edit review
export const editReviewZodSchema = z.object({
  reviewId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

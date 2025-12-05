import { z } from "zod";

export const createReviewZodSchema = z.object({
  planId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

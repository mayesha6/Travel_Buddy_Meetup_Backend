import { Router } from "express";
import { ReviewController } from "./reviews.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createReviewZodSchema } from "./reviews.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/", checkAuth(Role.USER), validateRequest(createReviewZodSchema), ReviewController.createReview);

router.get("/:planId", ReviewController.listReviews);

export const ReviewRoutes = router;

import { Router } from "express";
import { TravelPlanController } from "./travelPlan.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { createTravelPlanZodSchema, updateTravelPlanZodSchema, createRequestZodSchema, matchQueryZodSchema } from "./travelPlan.validation";
import { Role } from "../user/user.interface";
import { ensureOwnerOrAdmin, loadPlan } from "../../middleware/travelPlan";

const router = Router();

// create
router.post("/", checkAuth(...Object.values(Role)), validateRequest(createTravelPlanZodSchema), TravelPlanController.createPlan);

// list & search
router.get("/", TravelPlanController.listPlans);
router.get("/match", validateRequest(matchQueryZodSchema), TravelPlanController.matchPlans);

// plan CRUD
router.get("/:id", loadPlan, TravelPlanController.getPlan);
router.patch("/:id", checkAuth(...Object.values(Role)), loadPlan, ensureOwnerOrAdmin,  TravelPlanController.updatePlan);
router.delete("/:id", checkAuth(...Object.values(Role)), loadPlan, ensureOwnerOrAdmin, TravelPlanController.deletePlan);

// requests
router.post("/:id/request", checkAuth(...Object.values(Role)), loadPlan, validateRequest(createRequestZodSchema), TravelPlanController.createRequest);
router.get("/:id/requests", checkAuth(...Object.values(Role)), loadPlan, ensureOwnerOrAdmin, TravelPlanController.listRequests);

export const TravelPlanRoutes = router;

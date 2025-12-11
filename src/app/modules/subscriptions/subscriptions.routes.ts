import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { SubscriptionController } from "./subscriptions.controller";

const router = Router();

router.get("/", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getSubscriptions);
router.get("/:id", checkAuth(Role.USER, Role.ADMIN), SubscriptionController.getSubscription);

router.post("/", checkAuth(Role.ADMIN), SubscriptionController.createSubscription);
router.patch("/:id", checkAuth(Role.ADMIN, Role.USER), SubscriptionController.updateSubscription);
router.delete("/:id", checkAuth(Role.ADMIN), SubscriptionController.deleteSubscription);

export const SubscriptionRoutes = router;

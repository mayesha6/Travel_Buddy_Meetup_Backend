import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/create-intent/:subscriptionId", checkAuth(Role.USER, Role.ADMIN), PaymentController.createPaymentIntent);

router.post("/success", PaymentController.paymentSuccess);

router.post("/fail", PaymentController.paymentFail);

router.post("/cancel", PaymentController.paymentCancel);

router.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.downloadInvoice);

router.post("/validate", PaymentController.validatePayment);

export const PaymentRoutes = router;

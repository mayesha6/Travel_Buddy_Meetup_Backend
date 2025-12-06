import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SubscriptionService } from "./subscriptions.service";

// Existing methods
const getSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const subscriptions = await SubscriptionService.getAllSubscriptions();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscriptions fetched successfully",
    data: subscriptions,
  });
});

const getSubscription = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id;
  const subscription = await SubscriptionService.getSubscriptionById(subscriptionId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscription fetched successfully",
    data: subscription,
  });
});

// ✨ New methods
const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const subscription = await SubscriptionService.createSubscription(data);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Subscription created successfully",
    data: subscription,
  });
});

const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id;
  const data = req.body;
  const updated = await SubscriptionService.updateSubscription(subscriptionId, data);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscription updated successfully",
    data: updated,
  });
});

const deleteSubscription = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id;
  await SubscriptionService.deleteSubscription(subscriptionId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscription deleted successfully",
    data: null,
  });
});

export const SubscriptionController = {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};

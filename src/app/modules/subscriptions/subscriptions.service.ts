import httpStatus from "http-status-codes";
import { ISubscription } from "./subscriptions.interface";
import { Subscription } from "./subscriptions.model";
import AppError from "../../errorHelpers/AppErrors";

const getAllSubscriptions = async (): Promise<ISubscription[]> => {
  return Subscription.find({});
};

const getSubscriptionById = async (id: string): Promise<ISubscription> => {
  const subscription = await Subscription.findById(id);
  if (!subscription) throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  return subscription;
};

// ✨ New Methods
const createSubscription = async (data: ISubscription): Promise<ISubscription> => {
  const subscription = await Subscription.create(data);
  return subscription;
};

const updateSubscription = async (id: string, data: Partial<ISubscription>): Promise<ISubscription> => {
  const updated = await Subscription.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!updated) throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
  return updated;
};

const deleteSubscription = async (id: string): Promise<void> => {
  const deleted = await Subscription.findByIdAndDelete(id);
  if (!deleted) throw new AppError(httpStatus.NOT_FOUND, "Subscription not found");
};

export const SubscriptionService = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};

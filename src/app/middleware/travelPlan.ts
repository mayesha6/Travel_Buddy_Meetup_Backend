import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { TravelPlan } from "../modules/travelPlan/travelPlan.model";
import AppError from "../errorHelpers/AppErrors";

export const loadPlan = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const plan = await TravelPlan.findOne({ _id: id, isDeleted: false });
  if (!plan) {
    throw new AppError(404, "Travel plan not found");
  }
  (req as any).plan = plan;
  next();
};

export const ensureOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const decoded = req.user as JwtPayload;
  const plan = (req as any).plan;
  if (!decoded) throw new AppError(401, "Authentication required");
  if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") return next();
  if (plan.host.toString() === decoded.userId) return next();
  throw new AppError(403, "Forbidden");
};

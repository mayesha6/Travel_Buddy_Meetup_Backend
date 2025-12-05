import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TravelPlanService } from "./travelPlan.service";
import { JwtPayload } from "jsonwebtoken";
import { ITravelPlan } from "./travelPlan.interface";
import AppError from "../../errorHelpers/AppErrors";

const createPlan = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decoded = req.user as JwtPayload;
  const payload = req.body;
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);
  const plan = await TravelPlanService.createPlan(decoded.userId, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Travel plan created successfully",
    data: plan,
  });
});

const listPlans = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await TravelPlanService.getAllPlans(req.query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plans fetched",
    data: result.data,
    meta: result.meta,
  });
});

const getPlan = catchAsync(async (req: Request, res: Response) => {
  const plan = await TravelPlanService.getPlanById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plan retrieved",
    data: plan,
  });
});

const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);
  const updated = await TravelPlanService.updatePlan(req.params.id, payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plan updated",
    data: updated,
  });
});

const deletePlan = catchAsync(async (req: Request, res: Response) => {
  const deleted = await TravelPlanService.deletePlan(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Travel plan deleted (soft)",
    data: deleted,
  });
});

const matchPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelPlanService.matchPlans(req.query as Record<string, string>);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Matched travel plans",
    data: result.data,
    meta: result.meta,
  });
});

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const decoded = req.user as JwtPayload;
  const plan = (req as any).plan as ITravelPlan;

  if (!plan || !plan._id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing travel plan");
  }

  const request = await TravelPlanService.createRequest(
    plan._id.toString(),
    decoded.userId,
    req.body.message
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Request submitted",
    data: request,
  });
});


const listRequests = catchAsync(async (req: Request, res: Response) => {
  const plan = (req as any).plan;
  const requests = await TravelPlanService.listRequests(plan._id.toString());
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Requests retrieved",
    data: requests,
  });
});

export const TravelPlanController = {
  createPlan,
  listPlans,
  getPlan,
  updatePlan,
  deletePlan,
  matchPlans,
  createRequest,
  listRequests,
};

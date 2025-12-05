import { Types } from "mongoose";
import { TravelPlan } from "./travelPlan.model";
import AppError from "../../errorHelpers/AppErrors";
import { RequestStatus, TravelRequest } from "./travelRequest.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { travelPlanSearchableFields } from "./travelPlan.constant";
import { ITravelPlan, TravelType } from "./travelPlan.interface";

const parseDate = (d?: string) => (d ? new Date(d) : undefined);

const datesOverlap = (aStart: Date, aEnd: Date, bStart?: Date, bEnd?: Date) => {
  if (!bStart || !bEnd) return false;
  return aStart <= bEnd && aEnd >= bStart;
};

const intersectionCount = (a: string[] = [], b: string[] = []) => {
  const set = new Set(a.map((s) => s.toLowerCase()));
  return b.reduce((cnt, x) => (set.has(x.toLowerCase()) ? cnt + 1 : cnt), 0);
};

const createPlan = async (hostId: string, payload: Partial<ITravelPlan>) => {
  if (
    payload.startDate &&
    payload.endDate &&
    payload.startDate > payload.endDate
  ) {
    throw new AppError(400, "startDate must be before endDate");
  }
  const plan = await TravelPlan.create({
    ...payload,
    host: hostId,
    interests: payload.interests || [],
  });
  return plan;
};

export const getAllPlans = async (query: Record<string, string>) => {
  const baseQuery = TravelPlan.find({ isDeleted: false, visibility: "PUBLIC" });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .filter()
    .search(travelPlanSearchableFields)
    .sort()
    .fields()
    .paginate();

  if (query.destination) {
    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      destination: { $regex: query.destination, $options: "i" },
    });
  }

  if (query.start && query.end) {
    const start = new Date(query.start);
    const end = new Date(query.end);

    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      startDate: { $lte: end },
      endDate: { $gte: start },
    });
  }

  if (query.interests) {
    const items = query.interests.split(",").map((i) => i.trim());
    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      interests: { $in: items },
    });
  }

  if (query.travelType) {
    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      travelType: query.travelType,
    });
  }

  const [data, meta] = await Promise.all([
    queryBuilder
      .build()
      .populate("host", "name picture location travelInterests"),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getPlanById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new AppError(400, "Invalid plan id");
  const plan = await TravelPlan.findOne({ _id: id, isDeleted: false }).populate(
    "host",
    "-password"
  );
  if (!plan) throw new AppError(404, "Travel plan not found");
  return plan;
};

const updatePlan = async (planId: string, payload: Partial<ITravelPlan>) => {
  if (
    payload.startDate &&
    payload.endDate &&
    payload.startDate > payload.endDate
  ) {
    throw new AppError(400, "startDate must be before endDate");
  }
  const updated = await TravelPlan.findByIdAndUpdate(planId, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new AppError(404, "Travel plan not found");
  return updated;
};

const deletePlan = async (planId: string) => {
  const plan = await TravelPlan.findById(planId);
  if (!plan) throw new AppError(404, "Travel plan not found");
  plan.isDeleted = true;
  await plan.save();
  return plan;
};

const matchPlans = async (query: Record<string, string>) => {
  const {
    destination,
    start,
    end,
    interests,
    travelType,
    page = "1",
    limit = "20",
  } = query;
  const allCandidates = await TravelPlan.find({
    isDeleted: false,
    visibility: "PUBLIC",
  }).populate("host", "name picture location travelInterests");

  const userInterests = interests
    ? interests.split(",").map((s) => s.trim())
    : [];

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const scored = allCandidates
    .map((plan) => {
      let score = 0;
      if (
        destination &&
        plan.destination.toLowerCase().includes(destination.toLowerCase())
      )
        score += 50;
      if (
        startDate &&
        endDate &&
        datesOverlap(plan.startDate, plan.endDate, startDate, endDate)
      )
        score += 30;
      const shared = intersectionCount(plan.interests || [], userInterests);
      score += Math.min(shared * 10, 50);
      if (travelType && plan.travelType === (travelType as TravelType))
        score += 10;
      return { plan, score };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  const p = Number(page);
  const l = Math.min(Number(limit), 100);
  const startIdx = (p - 1) * l;
  const pageItems = scored.slice(startIdx, startIdx + l).map((s) => s.plan);

  return {
    data: pageItems,
    meta: {
      total: scored.length,
      page: p,
      limit: l,
      totalPage: Math.ceil(scored.length / l),
    },
  };
};

const createRequest = async (
  planId: string,
  requesterId: string,
  message?: string
) => {
  if (!Types.ObjectId.isValid(planId))
    throw new AppError(400, "Invalid plan id");
  const plan = await TravelPlan.findById(planId);
  if (!plan || plan.isDeleted) throw new AppError(404, "Plan not found");
  if (plan.host.toString() === requesterId)
    throw new AppError(400, "Host cannot request own plan");

  const existing = await TravelRequest.findOne({
    plan: planId,
    requester: requesterId,
    status: RequestStatus.PENDING,
  });
  if (existing)
    throw new AppError(409, "You already have a pending request for this plan");

  const request = await TravelRequest.create({
    plan: planId,
    requester: requesterId,
    message,
  });

  return request;
};

const listRequests = async (planId: string) => {
  const requests = await TravelRequest.find({ plan: planId }).populate(
    "requester",
    "name picture location"
  );
  return requests;
};

export const TravelPlanService = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  matchPlans,
  createRequest,
  listRequests,
};

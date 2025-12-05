import { z } from "zod";
import { TravelType, Visibility } from "./travelPlan.interface";

export const createTravelPlanZodSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  destination: z.string().min(2),
  startDate: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: "Invalid startDate" }),
  endDate: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: "Invalid endDate" }),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  travelType: z
    .enum(Object.values(TravelType) as [string, ...string[]])
    .optional(),
  interests: z.array(z.string()).optional(),
  visibility: z
    .enum(Object.values(Visibility) as [string, ...string[]])
    .optional(),
});

export const updateTravelPlanZodSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  destination: z.string().min(2).optional(),
  startDate: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: "Invalid startDate" })
    .optional(),
  endDate: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: "Invalid endDate" })
    .optional(),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  travelType: z
    .enum(Object.values(TravelType) as [string, ...string[]])
    .optional(),
  interests: z.array(z.string()).optional(),
  visibility: z
    .enum(Object.values(Visibility) as [string, ...string[]])
    .optional(),
});

export const createRequestZodSchema = z.object({
  message: z.string().max(1000).optional(),
});

export const matchQueryZodSchema = z.object({
  destination: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  interests: z.string().optional(), // comma separated
  travelType: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

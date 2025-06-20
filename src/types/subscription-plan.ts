import { subscriptionDuration } from "@/enums/subscription-duration";
import { z } from "zod";

// Define a schema for a single subject
export const subscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.string(),
  price: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const subscriptionPlanListSchema = z.object({
  data: z.array(subscriptionPlanSchema),
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  pageSize: z.number()
});

export const subscriptionPlanReqSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  duration: z.enum(subscriptionDuration.map(d => d.value) as [string, ...string[]]),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Price must be a positive number" }),
})

export type SubscriptionPlanReqDto = z.infer<typeof subscriptionPlanReqSchema>;
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type SubscriptionPlanList = z.infer<typeof subscriptionPlanListSchema>;
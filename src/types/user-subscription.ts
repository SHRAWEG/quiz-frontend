import { z } from "zod";

// Define a schema for a single subject
export const userSubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(), // Assuming the user object has an id field
  subscriptionPlanId: z.string(), // Assuming the subscription plan has an id field
  totalAmount: z.number(),
  productCode: z.string(),
  transactionUuid: z.string(),
  signature: z.string(),
  isActive: z.boolean()
});

export type UserSubscription = z.infer<typeof userSubscriptionSchema>;
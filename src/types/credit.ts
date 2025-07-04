import { z } from "zod";

// Define a schema for a single subject
export const initiateCreditSchema = z.object({
  userId: z.string(), // Assuming the user object has an id field
  totalAmount: z.number(),
  creditsAwarded: z.number(),
  productCode: z.string(),
  transactionUuid: z.string(),
  signature: z.string()
});

export type InitiateCredit = z.infer<typeof initiateCreditSchema>;
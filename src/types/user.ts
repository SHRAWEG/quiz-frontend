import { z } from "zod";
import { categorySchema } from "./category";

// Define a schema for a single subject
export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  role: z.string(),
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const userPreference = z.object({
  categories: z.array(categorySchema)
})

export const setUserPreferenceReq = z.object({
  categoryIds: z.string().array().min(1)
})

export type User = z.infer<typeof userSchema>;
export type UserPreference = z.infer<typeof userPreference>;
export type SetUserPreference = z.infer<typeof setUserPreferenceReq>;

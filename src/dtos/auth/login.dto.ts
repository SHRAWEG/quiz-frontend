import { z } from "zod";

export const loginDto = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
})

export type LoginDto = z.infer<typeof loginDto>;
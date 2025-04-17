import { z } from "zod";

export const loginReqDto = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
})

export const loginResDto = z.object({
  accessToken: z.string(),
  role: z.string(),
  email: z.string(),
  name: z.string()
})

export type LoginReqDto = z.infer<typeof loginReqDto>;
export type LoginResDto = z.infer<typeof loginResDto>;
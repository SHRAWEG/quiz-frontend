import { z } from "zod";

export const forgotPasswordReqDto = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email address" }),
});

export const forgotPasswordResDto = z.object({
  message: z.string(),
});

export const resetPasswordReqDto = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  newPassword: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordResDto = z.object({
  message: z.string(),
});

export type ForgotPasswordReqDto = z.infer<typeof forgotPasswordReqDto>;
export type ForgotPasswordResDto = z.infer<typeof forgotPasswordResDto>;
export type ResetPasswordReqDto = z.infer<typeof resetPasswordReqDto>;
export type ResetPasswordResDto = z.infer<typeof resetPasswordResDto>;
